export enum TokenType
{
    NUMBER,
    DICE,
    PLUS,
    MINUS,
    MULTIPLY,
    DIVIDE,
    LPAREN,
    RPAREN,
    LBRACKET,
    RBRACKET,
    LCURLY,
    RCURLY,
    IDENTIFIER,
    GREATER,
    MINOR,
    EOF
}

export interface Token
{
    type : TokenType;
    value : string;
}

export interface ASTNode { }

export interface DiceNode extends ASTNode
{
    type: "dice";
    sides: number;
    count: number;
}
export interface NumberNode extends ASTNode
{
    type: "number";
    value: number;
}

export interface IdentifierNode extends ASTNode
{
    type: "identifier";
    name: string;
}

export interface BinaryOperationNode extends ASTNode
{
    type: "binary_operation";
    operator: TokenType;
    left: ASTNode;
    right: ASTNode;
}

export interface FilterNode extends ASTNode
{
    type: "filter_expression";
    operator: TokenType;
    expression: ASTNode;
}

export type Environment = Map<string, number>;