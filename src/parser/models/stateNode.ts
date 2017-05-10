export abstract class StateNode {
    public startIndex: number;
    public endIndex: number;

    public abstract get childrenNodes(): StateNode[];
}
