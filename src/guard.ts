import * as estree from 'estree'

export function array_expression(node: estree.Node): node is estree.ArrayExpression {
  return node.type === 'ArrayExpression'
}

export function array_pattern(node: estree.Node): node is estree.ArrayPattern {
  return node.type === 'ArrayPattern'
}

export function arrow_function_expression(node: estree.Node): node is estree.ArrowFunctionExpression {
  return node.type === 'ArrowFunctionExpression'
}

export function assignment_expression(node: estree.Node): node is estree.AssignmentExpression {
  return node.type === 'AssignmentExpression'
}

export function assignment_pattern(node: estree.Node): node is estree.AssignmentPattern {
  return node.type === 'AssignmentPattern'
}

export function await_expression(node: estree.Node): node is estree.AwaitExpression {
  return node.type === 'AwaitExpression'
}

export function binary_expression(node: estree.Node): node is estree.BinaryExpression {
  return node.type === 'BinaryExpression'
}

export function block_statement(node: estree.Node): node is estree.BlockStatement {
  return node.type === 'BlockStatement'
}

export function break_statement(node: estree.Node): node is estree.BreakStatement {
  return node.type === 'BreakStatement'
}

export function call_expression(node: estree.Node): node is estree.CallExpression {
  return node.type === 'CallExpression'
}

export function catch_clause(node: estree.Node): node is estree.CatchClause {
  return node.type === 'CatchClause'
}

export function class_body(node: estree.Node): node is estree.ClassBody {
  return node.type === 'ClassBody'
}

export function class_declaration(node: estree.Node): node is estree.ClassDeclaration {
  return node.type === 'ClassDeclaration'
}

export function class_expression(node: estree.Node): node is estree.ClassExpression {
  return node.type === 'ClassExpression'
}

export function conditional_expression(node: estree.Node): node is estree.ConditionalExpression {
  return node.type === 'ConditionalExpression'
}

export function continue_statement(node: estree.Node): node is estree.ContinueStatement {
  return node.type === 'ContinueStatement'
}

export function debugger_statement(node: estree.Node): node is estree.DebuggerStatement {
  return node.type === 'DebuggerStatement'
}

export function do_while_statement(node: estree.Node): node is estree.DoWhileStatement {
  return node.type === 'DoWhileStatement'
}

export function empty_statement(node: estree.Node): node is estree.EmptyStatement {
  return node.type === 'EmptyStatement'
}

export function export_all_declaration(node: estree.Node): node is estree.ExportAllDeclaration {
  return node.type === 'ExportAllDeclaration'
}

export function export_default_declaration(node: estree.Node): node is estree.ExportDefaultDeclaration {
  return node.type === 'ExportDefaultDeclaration'
}

export function export_named_declaration(node: estree.Node): node is estree.ExportNamedDeclaration {
  return node.type === 'ExportNamedDeclaration'
}

export function export_specifier(node: estree.Node): node is estree.ExportSpecifier {
  return node.type === 'ExportSpecifier'
}

export function expression_statement(node: estree.Node): node is estree.ExpressionStatement {
  return node.type === 'ExpressionStatement'
}

export function for_in_statement(node: estree.Node): node is estree.ForInStatement {
  return node.type === 'ForInStatement'
}

export function for_of_statement(node: estree.Node): node is estree.ForOfStatement {
  return node.type === 'ForOfStatement'
}

export function for_statement(node: estree.Node): node is estree.ForStatement {
  return node.type === 'ForStatement'
}

export function function_declaration(node: estree.Node): node is estree.FunctionDeclaration {
  return node.type === 'FunctionDeclaration'
}

export function function_expression(node: estree.Node): node is estree.FunctionExpression {
  return node.type === 'FunctionExpression'
}

export function identifier(node: estree.Node): node is estree.Identifier {
  return node.type === 'Identifier'
}

export function if_statement(node: estree.Node): node is estree.IfStatement {
  return node.type === 'IfStatement'
}

/*export function import(node: estree.Node): node is estree.Import {
  return node.type === esprima.Syntax.Import
}*/

export function import_declaration(node: estree.Node): node is estree.ImportDeclaration {
  return node.type === 'ImportDeclaration'
}

export function import_default_specifier(node: estree.Node): node is estree.ImportDefaultSpecifier {
  return node.type === 'ImportDefaultSpecifier'
}

export function import_namespace_specifier(node: estree.Node): node is estree.ImportNamespaceSpecifier {
  return node.type === 'ImportNamespaceSpecifier'
}

export function import_specifier(node: estree.Node): node is estree.ImportSpecifier {
  return node.type === 'ImportSpecifier'
}

export function labeled_statement(node: estree.Node): node is estree.LabeledStatement {
  return node.type === 'LabeledStatement'
}

export function literal(node: estree.Node): node is estree.Literal {
  return node.type === 'Literal'
}

export function logical_expression(node: estree.Node): node is estree.LogicalExpression {
  return node.type === 'LogicalExpression'
}

export function member_expression(node: estree.Node): node is estree.MemberExpression {
  return node.type === 'MemberExpression'
}

export function meta_property(node: estree.Node): node is estree.MetaProperty {
  return node.type === 'MetaProperty'
}

export function method_definition(node: estree.Node): node is estree.MethodDefinition {
  return node.type === 'MethodDefinition'
}

export function new_expression(node: estree.Node): node is estree.NewExpression {
  return node.type === 'NewExpression'
}

export function object_expression(node: estree.Node): node is estree.ObjectExpression {
  return node.type === 'ObjectExpression'
}

export function object_pattern(node: estree.Node): node is estree.ObjectPattern {
  return node.type === 'ObjectPattern'
}

export function program(node: estree.Node): node is estree.Program {
  return node.type === 'Program'
}

export function property(node: estree.Node): node is estree.Property {
  return node.type === 'Property'
}

export function rest_element(node: estree.Node): node is estree.RestElement {
  return node.type === 'RestElement'
}

export function return_statement(node: estree.Node): node is estree.ReturnStatement {
  return node.type === 'ReturnStatement'
}

export function sequence_expression(node: estree.Node): node is estree.SequenceExpression {
  return node.type === 'SequenceExpression'
}

export function spread_element(node: estree.Node): node is estree.SpreadElement {
  return node.type === 'SpreadElement'
}

export function super_(node: estree.Node): node is estree.Super {
  return node.type === 'Super'
}

export function switch_case(node: estree.Node): node is estree.SwitchCase {
  return node.type === 'SwitchCase'
}

export function switch_statement(node: estree.Node): node is estree.SwitchStatement {
  return node.type === 'SwitchStatement'
}

export function tagged_template_expression(node: estree.Node): node is estree.TaggedTemplateExpression {
  return node.type === 'TaggedTemplateExpression'
}

export function template_element(node: estree.Node): node is estree.TemplateElement {
  return node.type === 'TemplateElement'
}

export function template_literal(node: estree.Node): node is estree.TemplateLiteral {
  return node.type === 'TemplateLiteral'
}

export function this_expression(node: estree.Node): node is estree.ThisExpression {
  return node.type === 'ThisExpression'
}

export function throw_statement(node: estree.Node): node is estree.ThrowStatement {
  return node.type === 'ThrowStatement'
}

export function try_statement(node: estree.Node): node is estree.TryStatement {
  return node.type === 'TryStatement'
}

export function unary_expression(node: estree.Node): node is estree.UnaryExpression {
  return node.type === 'UnaryExpression'
}

export function update_expression(node: estree.Node): node is estree.UpdateExpression {
  return node.type === 'UpdateExpression'
}

export function variable_declaration(node: estree.Node): node is estree.VariableDeclaration {
  return node.type === 'VariableDeclaration'
}

export function variable_declarator(node: estree.Node): node is estree.VariableDeclarator {
  return node.type === 'VariableDeclarator'
}

export function while_statement(node: estree.Node): node is estree.WhileStatement {
  return node.type === 'WhileStatement'
}

export function with_statement(node: estree.Node): node is estree.WithStatement {
  return node.type === 'WithStatement'
}

export function yield_expression(node: estree.Node): node is estree.YieldExpression {
  return node.type === 'YieldExpression'
}

