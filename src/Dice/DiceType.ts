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
    EOF
}

export interface Token
{
    type : TokenType;
    value : string;
}

export interface ASTNode { }

export type Environment = Map<string, number>;