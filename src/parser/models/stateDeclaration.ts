import { StateNode } from "./stateNode"
import { StateFile } from "./stateFile"

export class StateDeclaration extends StateNode {
    public id: string;
    public file: StateFile;
    public functions: StateFunction[] = new Array<StateFunction>();
    public get childrenNodes(): StateNode[] {
        return this.functions;
    }
}

export class StateFunction extends StateNode {
    public name: string;
    public declaration: StateDeclaration;
    public arguments: StateFunctionArgument[] = new Array<StateFunctionArgument>();
    public get childrenNodes(): StateNode[] {
        return this.arguments;
    }
}

export class StateFunctionArgument extends StateNode {
    public name: string;
    public value: StateFunctionArgumentValue;
    public function: StateFunction;
    public get childrenNodes(): StateNode[] {
        return [this.value];
    }
}

export class StateFunctionArgumentValue extends StateNode {
    public value: string; // TODO value.value sucks
    public argument: StateFunctionArgument;
    public get childrenNodes(): StateNode[] {
        return [];
    }
}