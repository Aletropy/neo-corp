import { Token, TokenType } from "./DiceType";

export default class DiceLexer
{
    private input : string;
    private index : number;

    constructor(input : string)
    {
        this.input = input;
        this.index = 0;
    }

    public GetAllTokens() : Token[]
    {
        const tokens : Token[] = [];
        let token : Token;

        do
        {
            token = this.Next();
            if(token.type !== TokenType.EOF)
                tokens.push(token);
        } while(token.type !== TokenType.EOF);

        return tokens;
    }

    public Next() : Token
    {
        this.SkipWhitespace();

        if(this.index >= this.input.length)
            return { type: TokenType.EOF, value: "" };

        const char = this.input[this.index];

        if(char.match(/\d/))
        {
            let value = "";
            while(this.index < this.input.length && this.input[this.index].match(/\d/))
            {
                value += this.input[this.index];
                this.index++;
            }
            return { type: TokenType.NUMBER, value };
        }

        if(char === 'd' || char === 'D')
        {
            this.index++;
            return { type: TokenType.DICE, value: "d" };
        }

        if(char.match(/[a-zA-Z_]/))
        {
            let value = "";
            while(this.index < this.input.length && this.input[this.index].match(/[a-zA-Z0-9_]/))
            {
                value += this.input[this.index];
                this.index++;
            }
            return { type: TokenType.IDENTIFIER, value };
        }

        if(char === '+')
        {
            this.index++;
            return { type: TokenType.PLUS, value: "+" };
        }
        if(char === '-')
        {
            this.index++;
            return { type: TokenType.MINUS, value: "-" };
        }
        if(char === '*')
        {
            this.index++;
            return { type: TokenType.MULTIPLY, value: "*" };
        }
        if(char === '/')
        {
            this.index++;
            return { type: TokenType.DIVIDE, value: "/" };
        }
        if(char === '(')
        {
            this.index++;
            return { type: TokenType.LPAREN, value: "(" };
        }
        if(char === ')')
        {
            this.index++;
            return { type: TokenType.RPAREN, value: ")" };
        }
        if(char === '[')
        {
            this.index++;
            return { type: TokenType.LBRACKET, value: "[" };
        }
        if(char === ']')
        {
            this.index++;
            return { type: TokenType.RBRACKET, value: "]" };
        }
        if(char === '{')
        {
            this.index++;
            return { type: TokenType.LCURLY, value: "{" };
        }
        if(char === '}')
        {
            this.index++;
            return { type: TokenType.RCURLY, value: "}" };
        }
        if(char === '>')
        {
            this.index++;
            return { type: TokenType.GREATER, value: ">" };
        }
        if(char === '<')
        {
            this.index++;
            return { type: TokenType.MINOR, value: "<" };
        }

        console.error(`Unexpected character at index ${this.index}: ${char}`);

        return { type: TokenType
            .EOF, value: "" };
    }

    private SkipWhitespace() : void
    {
        while(this.index < this.input.length && /\s/.test(this.input[this.index]))
            this.index++;
    }
}