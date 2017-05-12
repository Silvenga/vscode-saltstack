import *  as json from "../assets/stateFunctions.json";

let Definitions = (json as any) as StateDefinition[];

export class Assets {
    public static getStateDefinition(name: string): StateDefinition {
        let fullyQualifiedStateName = `salt.states.${name}`;
        let definition = Definitions.find(x => x.FunctionId == fullyQualifiedStateName);
        return definition;
    }
}

export class StateDefinition {
    public FunctionId: string;
    public Description: string;
    public Arguments: StateArgumentDefinition[];
}

export class StateArgumentDefinition {
    public Name: string;
    public DefaultValue: string;
    public IsRequired: boolean;
    public Description: string;
}