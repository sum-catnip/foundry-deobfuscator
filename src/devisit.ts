import { Visitor } from './visit'
import * as guard from './guard'
import { ScopeStackMapping } from './scope_mapping'

import * as tree from 'estree'

class FixedIdentifier implements tree.Identifier {
  type: 'Identifier' = 'Identifier'
  name: string

  constructor(name: string) { this.name = name }
}

export class DeVisitor extends Visitor {
  private map: tree.Literal[] = []
  private scopes = new ScopeStackMapping()
  private name: string = ''

  private read_map(defs: tree.Node | undefined) {
    if (! defs || ! guard.variable_declaration(defs))
      throw Error('obfuscation definition map missing')
    const decl = defs.declarations[0]
    if (! decl || ! decl.init || ! guard.array_expression(decl.init) || ! guard.identifier(decl.id))
      throw Error('invalid obfuscation definition map')

    this.name = decl.id.name
    this.map = decl.init.elements.map(e => {
      if (! guard.literal(e)) throw Error('invalid obfuscation map element type: ' + e.type)
      this.clean_literal(e)
      return e
    })
  }

  private clean_literal(lit: tree.Literal): tree.Literal {
    if (typeof lit.value === 'string' && typeof lit.raw === 'string') {
      lit.raw = JSON.stringify(eval(lit.raw))
      lit.value = lit.raw.slice(1, -1)
    }
    else if (typeof lit.value === 'number')
      lit.raw = lit.value.toString()

    return lit
  }

  private read_map_mixer(mix: tree.Node | undefined) {
    if (! mix || !guard.expression_statement(mix) || ! guard.call_expression(mix.expression))
      throw Error('obfuscation map mixer function missing')
    const off = mix.expression.arguments[1]
    if (! off || ! guard.literal(off) || ! off.value || ! (typeof off.value === "number"))
      throw Error('invalid obfuscation map mixer func')

    for (let i = off.value; i; i--)
      this.map.push(this.map.shift() as tree.Literal)
  }

  private read_map_alias(alias: tree.Node | undefined) {
    if (! alias || ! guard.variable_declaration(alias))
      throw Error('obfuscation map alis function missing')
    const decl = alias.declarations[0]
    if (! decl || ! guard.identifier(decl.id))
      throw Error('invalid obfuscation map alias function')

    this.name = decl.id.name
  }

  // why any?
  // because everyone is using different estree typings
  // and im going insane
  public visit_script(node: any): tree.Program {
    this.read_map(node.body.shift())
    this.read_map_mixer(node.body.shift())
    this.read_map_alias(node.body.shift())
    return super.visit_script(node)
  }

  protected visit_literal(node: tree.Literal): tree.Node {
    return super.visit_literal(this.clean_literal(node))
  }

  protected visit_method_definition(node: tree.MethodDefinition): tree.Node {
    const alias = this.resolve_alias(node.key)
    if (alias) {
      node.computed = false
      node.key = new FixedIdentifier(alias.value?.toString() ?? 'undefined')
    } else if (guard.literal(node.key) && typeof node.key.value == 'string') {
      node.computed = false
      node.key = new FixedIdentifier(node.key.value)
    }

    return super.visit_method_definition(node)
  }

  protected visit_function_expression(node: tree.FunctionExpression): tree.Node {
    node.id = this.opt_vst(node.id) as tree.Identifier
    return this.scopes.scoped('arg', () => {
      node.params = this.arr_vst(node.params) as Array<tree.Pattern>
      return this.scopes.scoped('loc', () => {
        node.body = this.vst_node(node.body) as tree.BlockStatement
        return node
      })
    })
  }

  protected visit_arrow_function_expression(node: tree.ArrowFunctionExpression): tree.Node {
    return this.scopes.scoped('arg', () => {
      node.params = this.arr_vst(node.params) as Array<tree.Pattern>
      return this.scopes.scoped('loc', () => {
        node.body = this.vst_node(node.body) as tree.BlockStatement | tree.Expression
        return node
      })
    })
  }

  protected visit_function_declaration(node: tree.FunctionDeclaration) {
    node.id = this.opt_vst(node.id) as tree.Identifier
    return this.scopes.scoped('arg', () => {
      node.params = this.arr_vst(node.params) as Array<tree.Pattern>
      return this.scopes.scoped('loc', () => {
        node.body = this.vst_node(node.body) as tree.BlockStatement
        return node
      })
    })
  }

  protected visit_for_statement(node: tree.ForStatement): tree.Node {
    return this.scopes.scoped('loc_i', () =>
      super.visit_for_statement(node)
    )
  }

  protected visit_for_in_statement(node: tree.ForInStatement): tree.Node {
    return this.scopes.scoped('loc_in', () =>
      super.visit_for_in_statement(node)
    )
  }

  protected visit_for_of_statement(node: tree.ForOfStatement): tree.Node {
    return this.scopes.scoped('loc_of', () =>
      super.visit_for_of_statement(node)
    )
  }

  protected visit_class_body(node: tree.ClassBody) {
    return this.scopes.scoped('member', () => super.visit_class_body(node))
  }

  protected visit_identifier(node: tree.Identifier) {
    if (node.name.startsWith('_0x'))
      node.name = this.scopes.resolve_or_new(node.name)
    return super.visit_identifier(node)
  }

  private resolve_alias(node: tree.Node): tree.Literal | null {
    if (guard.call_expression(node) && guard.identifier(node.callee) && node.callee.name == this.name) {
      const arg = node.arguments[0]
      if (! (arg && guard.literal(arg) && typeof arg.value === 'string'))
        throw Error('invalid obfuscation map alias call')
      return this.map[parseInt(arg.value)]
    }
    return null
  }

  protected visit_call_expression(node: tree.CallExpression) {
    const res = this.resolve_alias(node)
    if (res) return this.visit_literal(res)
    else return super.visit_call_expression(node)
  }

  private is_valid_id(node: tree.Node): undefined | string {
    return guard.literal(node) 
      && typeof node.value === 'string'
      && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(node.value)
      ? node.value
      : undefined
  }

  protected visit_member_expression(node: tree.MemberExpression) {
    const alias = this.resolve_alias(node.property)
    if (alias) node.property = alias
    const id = this.is_valid_id(node.property)
    if (id) {
      node.computed = false
      node.property = new FixedIdentifier(id)
    }

    return super.visit_member_expression(node)
  }
}
