import *  as json from "../assets/stateFunctions.json";

let Definitions = (json as any) as StateDefinition[];

export class Assets {
    public static getStateDefinition(name: string): StateDefinition {
        let fullyQualifiedStateName = `salt.states.${name}`;
        let definition = Definitions.find(x => x.functionId == fullyQualifiedStateName);
        return definition;
    }
}

export class StateDefinition {
    public functionId: string;
    public description: string;
    public arguments: StateArgumentDefinition[];
}

export class StateArgumentDefinition {
    public name: string;
    public defaultValue: string;
    public isRequired: boolean;
    public description: string;
}