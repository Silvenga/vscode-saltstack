import { StateNode } from "./stateNode"
import { StateFile } from "./stateFile"

export class StateInclude extends StateNode {
    public references = new Array<StateIncludeReference>();
    public file: StateFile;
    public get childrenNodes(): StateNode[] {
        return this.references;
    }
}

export class StateIncludeReference extends StateNode {
    public reference: string;
    public include: StateInclude;
    public get isRelative(): boolean {
        return this.reference.startsWith(".");
    }
    public get childrenNodes(): StateNode[] {
        return [];
    }
}