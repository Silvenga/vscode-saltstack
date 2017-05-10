import { HoverProvider, Hover, MarkedString, TextDocument, CancellationToken, Position, window, ProviderResult } from 'vscode';
import { StateParser } from "../parser/stateParser"
import { StateFile } from "../parser/models/stateFile"
import { StateNode } from "../parser/models/stateNode"
import { StateDeclaration, StateFunction, StateFunctionArgument, StateFunctionArgumentValue } from "../parser/models/stateDeclaration"

import { Definitions } from "./../assets"


export class FunctionDefinitionHoverProvider implements HoverProvider {
    provideHover(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Hover> {

        let offset = document.offsetAt(position);

        let host = new StateParser();

        let map = host.getMap(document.getText());

        let nodes = host.flatten(map);
        let reversedNodes = [].concat(nodes).reverse() as StateNode[];

        let hoverNode = nodes.find(x => x.startIndex <= offset && x.endIndex >= offset && !(x instanceof StateFile));

        if (hoverNode instanceof StateDeclaration) {
            return new Hover(`${hoverNode.id} (declaration)`);
        }

        if (hoverNode instanceof StateFunction) {
            let fullyQualifiedStateName = `salt.states.${hoverNode.name}`;
            let definition = Definitions.find(x => x.FunctionId == fullyQualifiedStateName);
            if (definition != null) {
                return new Hover(`${definition.Description} (function)`);
            }
        }

        let hoverFunction = reversedNodes.find(x => x.startIndex < hoverNode.startIndex && x instanceof StateFunction) as StateFunction;
        let fullyQualifiedStateName = `salt.states.${hoverFunction.name}`;
        let definition = Definitions.find(x => x.FunctionId == fullyQualifiedStateName);
        if (definition != null) {

            if (hoverNode instanceof StateFunctionArgument) {
                let argumentNode = hoverNode as StateFunctionArgument;

                let argument = definition.Arguments.find(x => x.Name == argumentNode.name)
                return new Hover(`_${argument.IsRequired ? "Required" : `Default: ${argument.DefaultValue}`}_\n\n${argument.Description} \n\n(argument for ${hoverFunction.name})`);
            }

            // if (hoverNode instanceof StateFunctionArgumentValue) {
            //     let argumentValueNode = hoverNode as StateFunctionArgumentValue;

            //     let argument = definition.Arguments.find(x => x.Name == argumentValueNode.)
            //     return new Hover(`${argument.Description} _${argument.IsRequired ? "Required" : argument.DefaultValue}_ (argument for ${hoverFunction.name})`);
            // }

        }

        if (hoverNode != null) {
            return new Hover(JSON.stringify(hoverNode));
        }

        return null;
    }
}

