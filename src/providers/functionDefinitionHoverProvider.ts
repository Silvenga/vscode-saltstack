import { HoverProvider, Hover, MarkedString, TextDocument, CancellationToken, Position, window, ProviderResult } from 'vscode';
import { StateParser, StateFile, StateDeclaration, StateFunction } from "../parser/stateParser"

import *  as json from "../../assets/stateFunctions.json";
let Definitions = (json as any) as Definition[];

export class FunctionDefinitionHoverProvider implements HoverProvider {
    provideHover(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Hover> {

        let offset = document.offsetAt(position);

        let host = new StateParser();

        let map = host.getMap(document.getText());

        let nodes = host.flatten(map);

        let hoverNode = nodes.find(x => x.startIndex <= offset && x.endIndex >= offset && !(x instanceof StateFile));

        if (hoverNode instanceof StateFunction) {
            let fullyQualifiedStateName = `salt.states.${hoverNode.name}`;
            let definition = Definitions.find(x => x.FunctionId == fullyQualifiedStateName);

            if (definition != null) {
                return new Hover(definition.Description);
            }
        }

        return null;
    }
}

class Definition {
    public FunctionId: string;
    public Description: string;
    public Arguments: DefinitionArgument[];
}

class DefinitionArgument {
    public Name: string;
    public DefaultValue: string;
    public IsRequired: boolean;
    public Description: string;
}