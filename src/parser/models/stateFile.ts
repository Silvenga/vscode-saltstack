import { StateNode } from "./stateNode"
import { StateDeclaration } from "./stateDeclaration"

export class StateFile extends StateNode {
    public declarations: StateDeclaration[] = new Array<StateDeclaration>();
    public get childrenNodes(): StateNode[] {
        return this.declarations;
    }
}