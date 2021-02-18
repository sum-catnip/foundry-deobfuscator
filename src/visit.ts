import * as tree from 'estree'
import { snakeCase } from 'snake-case'

type Zip<T extends unknown[][]> = { [I in keyof T]: T[I] extends (infer U)[] ? U : never }[]
function zip<T extends unknown[][]>(...args: T): Zip<T> {
  return <Zip<T>><unknown>(args[0].map((_, c) => args.map(row => row[c])))
}

export class Visitor {
  public visit_script(script: tree.Program): tree.Program {
    script.body = this.arr_vst(script.body) as Array<tree.Statement>
    return script
  }

  protected vst_node(node: tree.Node): tree.Node {
    return ((this as any)[`visit_${snakeCase(node.type)}`] as (node: tree.Node) => tree.Node)
      .call(this, node)
  }

  protected arr_vst(nodes: tree.Node[]): tree.Node[] {
    return nodes.map(this.vst_node, this)
  }

  protected opt_vst(node: tree.Node | undefined | null): tree.Node | null | undefined {
    if (node) return this.vst_node(node)
    return node
  }

  protected visit_array_expression(node: tree.ArrayExpression): tree.Node {
    node.elements = this.arr_vst(node.elements) as Array<tree.Expression | tree.SpreadElement>
    return node
  }

  protected visit_array_pattern(node: tree.ArrayPattern): tree.Node {
    return this.visit_array_expression(node as unknown as tree.ArrayExpression)
  }

  protected visit_arrow_function_expression(node: tree.ArrowFunctionExpression): tree.Node {
    node.params = this.arr_vst(node.params) as Array<tree.Pattern>
    node.body = this.vst_node(node.body) as tree.BlockStatement | tree.Expression
    return node
  }

  protected visit_assignment_expression(node: tree.AssignmentExpression): tree.Node {
    return this.visit_binary_expression(node as unknown as tree.BinaryExpression)
  }

  protected visit_assignment_pattern(node: tree.AssignmentPattern): tree.Node {
    node.left = this.vst_node(node.left) as tree.Pattern
    node.right = this.vst_node(node.right) as tree.Expression
    return node
  }

  protected visit_await_expression(node: tree.AwaitExpression): tree.Node {
    node.argument = this.vst_node(node.argument) as tree.Expression
    return node
  }

  protected visit_binary_expression(node: tree.BinaryExpression): tree.Node {
    node.left = this.vst_node(node.left) as tree.Expression
    node.right = this.vst_node(node.right) as tree.Expression
    return node
  }

  protected visit_block_statement(node: tree.BlockStatement): tree.Node {
    node.body = this.arr_vst(node.body) as Array<tree.Statement>
    return node
  }

  protected visit_break_statement(node: tree.BreakStatement): tree.Node {
    node.label = this.opt_vst(node.label) as tree.Identifier | null
    return node
  }

  protected visit_call_expression(node: tree.CallExpression): tree.Node {
    node.callee = this.vst_node(node.callee) as tree.Expression | tree.Super
    node.arguments = this.arr_vst(node.arguments) as Array<tree.Expression | tree.SpreadElement>
    return node
  }

  protected visit_catch_clause(node: tree.CatchClause): tree.Node {
    node.param = this.opt_vst(node.param) as tree.Pattern | null
    node.body = this.vst_node(node.body) as tree.BlockStatement
    return node
  }

  protected visit_class_body(node: tree.ClassBody): tree.Node {
    node.body = this.arr_vst(node.body) as Array<tree.MethodDefinition>
    return node
  }

  protected visit_class_declaration(node: tree.ClassDeclaration): tree.Node {
    node.id = this.opt_vst(node.id) as tree.Identifier
    node.superClass = this.opt_vst(node.superClass) as tree.Expression | null
    node.body = this.vst_node(node.body) as tree.ClassBody
    return node
  }

  protected visit_class_expression(node: tree.ClassExpression): tree.Node {
    node.id = this.opt_vst(node.id) as tree.Identifier
    node.superClass = this.opt_vst(node.superClass) as tree.Expression | null
    node.body = this.vst_node(node.body) as tree.ClassBody
    return node
  }

  protected visit_conditional_expression(node: tree.ConditionalExpression): tree.Node {
    node.test = this.vst_node(node.test) as tree.Expression
    node.consequent = this.vst_node(node.consequent) as tree.Expression
    node.alternate = this.vst_node(node.alternate) as tree.Expression
    return node
  }

  protected visit_continue_statement(node: tree.ContinueStatement): tree.Node {
    node.label = this.opt_vst(node.label) as tree.Identifier
    return node
  }

  protected visit_debugger_statement(node: tree.DebuggerStatement) : tree.Node {
    return node
  }

  protected visit_do_while_statement(node: tree.DoWhileStatement): tree.Node {
    node.body = this.vst_node(node.body) as tree.Statement
    node.test = this.vst_node(node.test) as tree.Expression
    return node
  }

  protected visit_empty_statement(node: tree.EmptyStatement) : tree.Node {
    return node
  }

  protected visit_export_all_declaration(node: tree.ExportAllDeclaration): tree.Node {
    node.source = this.vst_node(node.source) as tree.Literal
    return node
  }

  protected visit_export_default_declaration(node: tree.ExportDefaultDeclaration): tree.Node {
    node.declaration = this.vst_node(node.declaration) as tree.Declaration | tree.Expression
    return node
  }

  protected visit_export_named_declaration(node: tree.ExportNamedDeclaration): tree.Node {
    node.declaration = this.opt_vst(node.declaration) as tree.Declaration
    node.specifiers = this.arr_vst(node.specifiers) as Array<tree.ExportSpecifier>
    node.source = this.opt_vst(node.source) as tree.Literal
    return node
  }

  protected visit_export_specifier(node: tree.ExportSpecifier): tree.Node {
    node.exported = this.visit_identifier(node.exported) as tree.Identifier
    return node
  }

  protected visit_expression_statement(node: tree.ExpressionStatement): tree.Node {
    node.expression = this.vst_node(node.expression) as tree.Expression
    return node
  }

  protected visit_for_in_statement(node: tree.ForInStatement): tree.Node {
    node.left = this.vst_node(node.left) as tree.Pattern | tree.VariableDeclaration
    node.right = this.vst_node(node.right) as tree.Expression
    node.body = this.vst_node(node.body) as tree.Statement
    return node
  }

  protected visit_for_of_statement(node: tree.ForOfStatement): tree.Node {
    node.left = this.vst_node(node.left) as tree.VariableDeclaration | tree.Pattern
    node.right = this.vst_node(node.right) as tree.Expression
    node.body = this.vst_node(node.body) as tree.Statement
    return node
  }

  protected visit_for_statement(node: tree.ForStatement): tree.Node {
    node.init = this.opt_vst(node.init) as tree.VariableDeclaration | tree.Expression
    node.test = this.opt_vst(node.test) as tree.Expression
    node.update = this.opt_vst(node.update) as tree.Expression
    node.body = this.vst_node(node.body) as tree.Statement
    return node
  }

  protected visit_function_declaration(node: tree.FunctionDeclaration): tree.Node {
    node.params = this.arr_vst(node.params) as Array<tree.Pattern>
    node.id = this.opt_vst(node.id) as tree.Identifier
    node.body = this.vst_node(node.body) as tree.BlockStatement
    return node
  }

  protected visit_function_expression(node: tree.FunctionExpression): tree.Node {
    node.params = this.arr_vst(node.params) as Array<tree.Pattern>
    node.id = this.opt_vst(node.id) as tree.Identifier
    node.body = this.vst_node(node.body) as tree.BlockStatement
    return node
  }

  protected visit_identifier(node: tree.Identifier) : tree.Node {
    return node
  }

  protected visit_if_statement(node: tree.IfStatement): tree.Node {
    node.test = this.vst_node(node.test) as tree.Expression
    node.consequent = this.vst_node(node.consequent) as tree.Statement
    node.alternate = this.opt_vst(node.alternate) as tree.Statement
    return node
  }

  protected visit_import_declaration(node: tree.ImportDeclaration): tree.Node {
    node.specifiers = this.arr_vst(node.specifiers) as
      Array<tree.ImportSpecifier | tree.ImportDefaultSpecifier | tree.ImportNamespaceSpecifier>
    node.source = this.opt_vst(node.source) as tree.Literal
    return node
  }

  protected visit_import_default_specifier(node: tree.ImportDefaultSpecifier): tree.Node {
    node.local = this.vst_node(node.local) as tree.Identifier
    return node
  }

  protected visit_import_namespace_specifier(node: tree.ImportNamespaceSpecifier): tree.Node {
    node.local = this.visit_identifier(node.local) as tree.Identifier
    return node
  }

  protected visit_import_specifier(node: tree.ImportSpecifier): tree.Node {
    node.local = this.vst_node(node.local) as tree.Identifier
    node.imported = this.vst_node(node.imported) as tree.Identifier
    return node
  }

  protected visit_labeled_statement(node: tree.LabeledStatement): tree.Node {
    node.label = this.visit_identifier(node.label) as tree.Identifier
    node.body = this.vst_node(node.body) as tree.Statement
    return node
  }

  protected visit_literal(node: tree.Literal) : tree.Node {
    return node
  }

  protected visit_logical_expression(node: tree.LogicalExpression): tree.Node {
    this.visit_binary_expression(node as unknown as tree.BinaryExpression)
    return node
  }

  protected visit_member_expression(node: tree.MemberExpression): tree.Node {
    node.object = this.vst_node(node.object) as tree.Expression | tree.Super
    node.property = this.vst_node(node.property) as tree.Expression
    return node
  }

  protected visit_meta_property(node: tree.MetaProperty): tree.Node {
    node.meta = this.visit_identifier(node.meta) as tree.Identifier
    node.property = this.visit_identifier(node.property) as tree.Identifier
    return node
  }

  protected visit_method_definition(node: tree.MethodDefinition): tree.Node {
    node.key = this.vst_node(node.key) as tree.Expression
    node.value = this.vst_node(node.value) as tree.FunctionExpression
    return node
  }

  protected visit_new_expression(node: tree.NewExpression): tree.Node {
    node.callee = this.vst_node(node.callee) as tree.Expression | tree.Super
    node.arguments = this.arr_vst(node.arguments) as Array<tree.Expression | tree.SpreadElement>
    return node
  }

  protected visit_object_expression(node: tree.ObjectExpression): tree.Node {
    node.properties = this.arr_vst(node.properties) as Array<tree.Property | tree.SpreadElement>
    return node
  }

  protected visit_object_pattern(node: tree.ObjectPattern): tree.Node {
    return this.visit_object_expression(node as unknown as tree.ObjectExpression)
  }

  protected visit_property(node: tree.Property): tree.Node {
    node.key = this.vst_node(node.key) as tree.Expression
    node.value = this.vst_node(node.value) as tree.Expression | tree.Pattern
    return node
  }

  protected visit_rest_element(node: tree.RestElement): tree.Node {
    node.argument = this.vst_node(node.argument) as tree.Pattern
    return node
  }

  protected visit_return_statement(node: tree.ReturnStatement): tree.Node {
    node.argument = this.opt_vst(node.argument) as tree.Expression
    return node
  }

  protected visit_sequence_expression(node: tree.SequenceExpression): tree.Node {
    node.expressions = this.arr_vst(node.expressions) as Array<tree.Expression>
    return node
  }

  protected visit_spread_element(node: tree.SpreadElement): tree.Node {
    return this.visit_rest_element(node as unknown as tree.RestElement)
  }

  protected visit_super(node: tree.Super) : tree.Node { return node }

  protected visit_switch_case(node: tree.SwitchCase): tree.Node {
    node.test = this.opt_vst(node.test) as tree.Expression
    node.consequent = this.arr_vst(node.consequent) as Array<tree.Statement>
    return node
  }

  protected visit_switch_statement(node: tree.SwitchStatement): tree.Node {
    node.discriminant = this.vst_node(node.discriminant) as tree.Expression
    node.cases = this.arr_vst(node.cases) as Array<tree.SwitchCase>
    return node
  }

  protected visit_tagged_template_expression(node: tree.TaggedTemplateExpression): tree.Node {
    node.tag = this.vst_node(node.tag) as tree.Expression
    node.quasi = this.vst_node(node.quasi) as tree.TemplateLiteral
    return node
  }

  protected visit_template_element(node: tree.TemplateElement) : tree.Node {
    return node
  }

  protected visit_template_literal(node: tree.TemplateLiteral): tree.Node {
    const quasi = []
    const expr = []
    for (const [q, e] of zip(node.quasis, node.expressions)) {
      quasi.push(this.vst_node(q) as tree.TemplateElement)
      expr.push(this.vst_node(e) as tree.Expression)
    }

    node.quasis = quasi
    node.expressions = expr

    return node
  }

  protected visit_this_expression(node: tree.ThisExpression) : tree.Node {
    return node
  }

  protected visit_throw_statement(node: tree.ThrowStatement): tree.Node {
    node.argument = this.vst_node(node.argument) as tree.Expression
    return node
  }

  protected visit_try_statement(node: tree.TryStatement): tree.Node {
    node.block = this.vst_node(node.block) as tree.BlockStatement
    node.handler = this.opt_vst(node.handler) as tree.CatchClause
    node.finalizer = this.opt_vst(node.finalizer) as tree.BlockStatement
    return node
  }

  protected visit_unary_expression(node: tree.UnaryExpression): tree.Node {
    node.argument = this.vst_node(node.argument) as tree.Expression
    return node
  }

  protected visit_update_expression(node: tree.UpdateExpression): tree.Node {
    return this.visit_unary_expression(node as unknown as tree.UnaryExpression)
  }

  protected visit_variable_declaration(node: tree.VariableDeclaration): tree.Node {
    node.declarations = this.arr_vst(node.declarations) as Array<tree.VariableDeclarator>
    return node
  }

  protected visit_variable_declarator(node: tree.VariableDeclarator): tree.Node {
    node.id = this.vst_node(node.id) as tree.Pattern
    node.init = this.opt_vst(node.init) as tree.Expression
    return node
  }

  protected visit_while_statement(node: tree.WhileStatement): tree.Node {
    node.test = this.vst_node(node.test) as tree.Expression
    node.body = this.vst_node(node.body) as tree.Statement
    return node
  }

  protected visit_with_statement(node: tree.WithStatement): tree.Node {
    node.object = this.vst_node(node.object) as tree.Expression
    node.body = this.vst_node(node.body) as tree.Statement
    return node
  }

  protected visit_yield_expression(node: tree.YieldExpression): tree.Node {
    node.argument = this.opt_vst(node.argument) as tree.Expression
    return node
  }
}

