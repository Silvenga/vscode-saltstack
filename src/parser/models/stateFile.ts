import { StateNode } from "./stateNode"
import { StateDeclaration } from "./stateDeclaration"
import { StateInclude } from "./stateInclude"

export class StateFile extends StateNode {
    public declarations: StateDeclaration[] = new Array<StateDeclaration>();
    public include: StateInclude;
    public get childrenNodes(): StateNode[] {
        if (this.include == null) {
            return this.declarations;
        }
        return [this.include as StateNode].concat(this.declarations);
    }
}