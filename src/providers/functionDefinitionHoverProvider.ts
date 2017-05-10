import { HoverProvider, Hover, MarkedString, TextDocument, CancellationToken, Position, window, ProviderResult } from 'vscode';
import { StateParser } from "../parser/stateParser"
import { StateFile } from "../parser/models/stateFile"
import { StateDeclaration, StateFunction, StateFunctionArgument } from "../parser/models/stateDeclaration"

import { Definitions } from "./../assets"


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

