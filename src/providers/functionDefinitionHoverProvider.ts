import { HoverProvider, Hover, MarkedString, TextDocument, CancellationToken, Position, window, ProviderResult } from 'vscode';
import { FileParser } from "../parser/fileParser"
import { StateFile } from "../parser/models/stateFile"
import { StateNode } from "../parser/models/stateNode"
import { StateInclude, StateIncludeReference } from "../parser/models/stateInclude"
import { StateDeclaration, StateFunction, StateFunctionArgument, StateFunctionArgumentValue } from "../parser/models/stateDeclaration"

import { Assets } from "./../assets"

export class FunctionDefinitionHoverProvider implements HoverProvider {
    provideHover(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Hover> {

        let offset = document.offsetAt(position);
        let host = new FileParser();
        let map = host.mapFile(document.getText());
        let nodes = host.flatten(map);

        let hoverNode = nodes.find(x => x.startIndex <= offset && x.endIndex >= offset && !(x instanceof StateFile));

        if (hoverNode instanceof StateDeclaration) {
            return this.toHover(`${hoverNode.id} (declaration)`);
        }

        if (hoverNode instanceof StateFunction) {
            let definition = Assets.getStateDefinition(hoverNode.name);
            if (definition != null) {
                return this.toHover(`${definition.description} (function)`);
            }
        }

        if (hoverNode instanceof StateFunctionArgument) {
            let argumentName = hoverNode.name;
            let definition = Assets.getStateDefinition(hoverNode.function.name);
            let argument = definition.arguments.find(x => x.name == argumentName);
            let message =
                `_${argument.isRequired ? "Required" : `Default: ${argument.defaultValue}`}_\n`
                + `${argument.description}\n`
                + `(argument for ${definition.functionId})`;
            return this.toHover(message);
        }

        if (hoverNode instanceof StateFunctionArgumentValue) {
            let argumentName = hoverNode.argument.name;
            let definition = Assets.getStateDefinition(hoverNode.argument.function.name);
            let argument = definition.arguments.find(x => x.name == argumentName);
            let message =
                `_${argument.isRequired ? "Required" : `Default: ${argument.defaultValue}`}_\n`
                + `(argument value for ${definition.functionId}.${argument.name})`;
            return this.toHover(message);
        }

        if (hoverNode instanceof StateInclude) {
            let message = `(include)`;
            return this.toHover(message);
        }

        if (hoverNode instanceof StateIncludeReference) {
            let message = `${hoverNode.reference} _${hoverNode.isRelative ? "Relative" : "Absolute"}_ (include reference)`;
            return this.toHover(message);
        }

        if (hoverNode != null) {
            return new Hover("Known");
        }

        return null;
    }

    private toHover(input: string): Hover {
        let formatted = input.replace(/\r?\n/, "\n\n");
        return new Hover(formatted);
    }
}

