import DiceParser from "./DiceParser";
import { ASTNode, BinaryOperationNode, DiceNode, FilterNode, NumberNode, TokenType } from "./DiceType";

export interface EvaluationResult 
{
    value: number;
    stringValue: string;
    rolls?: number[];
}

export default class DiceInterpreter
{
    private parser!: DiceParser;

    public Interpret(input : string) : EvaluationResult
    {
        this.parser = new DiceParser(input);
        const ast = this.parser.Parse();
        return this.Evaluate(ast);
    }

    private Evaluate(ast : ASTNode) : EvaluationResult
    {
        switch((ast as any).type)
        {
            case "number":
                return this.EvaluateNumber(ast as NumberNode);
            case "binary_operation":
                return this.EvaluateBinaryOperation(ast as BinaryOperationNode);
            case "dice":
                return this.EvaluateDice(ast as DiceNode);
            case "filter_expression":
                return this.EvaluateFilter(ast as FilterNode);
            default:
                throw new Error(`Unknown AST node type: ${(ast as any).type}`);
        }
    }
    

    private EvaluateNumber(node : NumberNode) : EvaluationResult
    {
        return {
            value: node.value,
            stringValue: node.value.toString()
        }
    }

    private EvaluateBinaryOperation(node: BinaryOperationNode): EvaluationResult 
    {
        const leftResult = this.Evaluate(node.left);
        const rightResult = this.Evaluate(node.right);

        let resultValue : number;
        let operatorString : string;

        switch(node.operator)
        {
            case TokenType.PLUS:
                resultValue = leftResult.value + rightResult.value;
                operatorString = "+";
                break;
            case TokenType.MINUS:
                resultValue = leftResult.value - rightResult.value;
                operatorString = "-";
                break;
            case TokenType.MULTIPLY:
                resultValue = leftResult.value * rightResult.value;
                operatorString = "*";
                break;
            case TokenType.DIVIDE:
                if(rightResult.value === 0) {
                    resultValue = 0;
                    operatorString = "0 (division by zero)";
                    break;
                }
                resultValue = leftResult.value / rightResult.value;
                operatorString = "/";
                break;
            default:
                throw new Error(`Unknown operator: ${node.operator}`);
        }

        return {
            value: resultValue,
            stringValue: `${leftResult.stringValue} ${operatorString} ${rightResult.stringValue} = ${resultValue}`
        }
    }

    private EvaluateDice(node : DiceNode) : EvaluationResult
    {
        const rolls : number[] = [];
        let sum = 0;

        for(let i = 0; i < node.count; i++)
        {
            const roll = Math.floor(Math.random() * node.sides) + 1;
            rolls.push(roll);
            sum += roll;
        }

        const rollsString = `[${rolls.join(", ")}]`;

        return {
            value: sum,
            stringValue: `${rollsString}(${sum})`,
            rolls: rolls
        }
    }

    private EvaluateFilter(node : FilterNode) : EvaluationResult
    {
        const expressionResult = this.Evaluate(node.expression);

        if(!expressionResult.rolls || expressionResult.rolls.length === 0)
        {
            throw new Error("Filter operation requires a dice roll result.");
        }

        let filteredValue : number;
        const rollsString = `[${expressionResult.rolls.join(", ")}]`;
        if(node.operator === TokenType.GREATER) {
            filteredValue = Math.max(...expressionResult.rolls);
        } else if(node.operator === TokenType.MINOR) {
            filteredValue = Math.min(...expressionResult.rolls);
        }
        else {
            throw new Error(`Unknown filter operator: ${node.operator}`);
        }

        return {
            value: filteredValue,
            stringValue: `${rollsString}(${filteredValue})`,
            rolls: expressionResult.rolls
        }
    }
    
}