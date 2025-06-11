import DiceLexer from "./DiceLexer";
import { ASTNode, Token, TokenType } from "./DiceType";

export default class DiceParser
{
    private tokens : Token[];
    private index : number;

    constructor(input : string)
    {
        const lexer = new DiceLexer(input);
        this.index = 0;
        this.tokens = lexer.GetAllTokens();
    }

    public Parse() : ASTNode
    {
        return this.Expression();
    }

    private Expression() : ASTNode
    {
        let left = this.Term();

        while(this.index < this.tokens.length && (this.tokens[this.index].type === TokenType.PLUS || this.tokens[this.index].type === TokenType.MINUS))
        {
            const operator = this.tokens[this.index];
            this.index++;
            const right = this.Term();
            left = { type: "binary_operation", operator: operator.type, left, right };
        }

        return left;
    }

    private Term() : ASTNode
    {
        let left = this.Factor();

        while(this.index < this.tokens.length && (this.tokens[this.index].type === TokenType.MULTIPLY || this.tokens[this.index].type === TokenType.DIVIDE))
        {
            const operator = this.tokens[this.index];
            this.index++;
            const right = this.Factor();
            left = { type: "binary_operation", operator: operator.type, left, right };
        }

        return left;
    }

    private Factor() : ASTNode
    {
        const token = this.tokens[this.index];

        if(token.type === TokenType.NUMBER)
        {
            const peek = this.Peek();
            if(peek.type === TokenType.DICE)
            {
                const count = parseInt(token.value, 10);
                this.index += 2; // Skip number and 'd'
                
                const sidesToken = this.tokens[this.index];
                if(sidesToken.type === TokenType.NUMBER)
                {
                    this.index++;
                    return { type: "dice", sides: parseInt(sidesToken.value, 10), count };
                }
                throw new Error("Expected number after 'd'");
            }
            this.index++;
            return { type: "number", value: parseInt(token.value, 10) };
        }
        else if(token.type === TokenType.GREATER || token.type === TokenType.MINOR)
        {
            this.index++;
            const lBracket = this.tokens[this.index];
            if(lBracket.type !== TokenType.LBRACKET)
                throw new Error("Expected '[' after '>' or '<'");
            this.index++;
            const innerExpr = this.Expression();
            const rBracket = this.tokens[this.index];
            if(rBracket.type !== TokenType.RBRACKET)
                throw new Error("Expected ']' after expression");
            this.index++;
            return { type: "filter_expression", operator: token.type, expression: innerExpr };
        }
        else if(token.type === TokenType.DICE)
        {
            this.index++;
            const sidesToken = this.tokens[this.index];
            if(sidesToken.type === TokenType.NUMBER)
            {
                this.index++;
                return { type: "dice", sides: parseInt(sidesToken.value, 10), count: 1 };
            }
            throw new Error("Expected number after 'd'");
        }
        else if(token.type === TokenType.IDENTIFIER)
        {
            this.index++;
            return { type: "identifier", name: token.value };
        }
        else if(token.type === TokenType.LPAREN)
        {
            this.index++;
            const expr = this.Expression();
            if(this.tokens[this.index].type !== TokenType.RPAREN)
                throw new Error("Expected ')'");
            this.index++;
            return expr;
        }

        throw new Error(`Unexpected token: ${token.value}`);
    }

    private Peek() : Token
    {
        if(this.index + 1 < this.tokens.length)
        {
            return this.tokens[this.index + 1];
        }
        return { type: TokenType.EOF, value: "" };
    }
}