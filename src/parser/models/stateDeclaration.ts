import { StateNode } from "./stateNode"

export class StateDeclaration extends StateNode {
    public id: string;
    public functions: StateFunction[] = new Array<StateFunction>();
    public get childrenNodes(): StateNode[] {
        return this.functions;
    }
}

export class StateFunction extends StateNode {
    public name: string;
    public arguments: StateFunctionArgument[] = new Array<StateFunctionArgument>();
    public get childrenNodes(): StateNode[] {
        return this.arguments;
    }
}

export class StateFunctionArgument extends StateNode {
    public name: string;
    public value: string;
    public get childrenNodes(): StateNode[] {
        return [];
    }
}