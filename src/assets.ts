import *  as json from "../assets/stateFunctions.json";

export let Definitions = (json as any) as Definition[];

export class Definition {
    public FunctionId: string;
    public Description: string;
    public Arguments: DefinitionArgument[];
}

export class DefinitionArgument {
    public Name: string;
    public DefaultValue: string;
    public IsRequired: boolean;
    public Description: string;
}