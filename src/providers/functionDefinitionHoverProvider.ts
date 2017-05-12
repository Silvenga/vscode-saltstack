import { HoverProvider, Hover, MarkedString, TextDocument, CancellationToken, Position, window, ProviderResult } from 'vscode';
import { StateParser } from "../parser/stateParser"
import { StateFile } from "../parser/models/stateFile"
import { StateNode } from "../parser/models/stateNode"
import { StateDeclaration, StateFunction, StateFunctionArgument, StateFunctionArgumentValue } from "../parser/models/stateDeclaration"

import { Assets } from "./../assets"


export class FunctionDefinitionHoverProvider implements HoverProvider {
    provideHover(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Hover> {

        let offset = document.offsetAt(position);
        let host = new StateParser();
        let map = host.mapFile(document.getText());
        let nodes = host.flatten(map);

        let hoverNode = nodes.find(x => x.startIndex <= offset && x.endIndex >= offset && !(x instanceof StateFile));

        if (hoverNode instanceof StateDeclaration) {
            return new Hover(`${hoverNode.id} (declaration)`);
        }

        if (hoverNode instanceof StateFunction) {
            let definition = Assets.getStateDefinition(hoverNode.name);
            if (definition != null) {
                return new Hover(`${definition.Description} (function)`);
            }
        }

        if (hoverNode instanceof StateFunctionArgument) {
            let argumentName = hoverNode.name;
            let definition = Assets.getStateDefinition(hoverNode.function.name);
            let argument = definition.Arguments.find(x => x.Name == argumentName);
            let message =
                `_${argument.IsRequired ? "Required" : `Default: ${argument.DefaultValue}`}_\n\n`
                + `${argument.Description}\n\n`
                + `(argument for ${definition.FunctionId})`;
            return new Hover(message);
        }

        if (hoverNode instanceof StateFunctionArgumentValue) {
            let argumentName = hoverNode.argument.name;
            let definition = Assets.getStateDefinition(hoverNode.argument.function.name);
            let argument = definition.Arguments.find(x => x.Name == argumentName);
            let message =
                `_${argument.IsRequired ? "Required" : `Default: ${argument.DefaultValue}`}_\n\n`
                + `(argument value for ${definition.FunctionId}.${argument.Name})`;
            return new Hover(message);
        }

        if (hoverNode != null) {
            return new Hover(JSON.stringify(hoverNode));
        }

        return null;
    }
}

