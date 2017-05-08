import { HoverProvider, Hover, MarkedString, TextDocument, CancellationToken, Position, window, ProviderResult } from 'vscode';
import { ParserHost } from "../parser/parserHost"

export class FunctionDefinitionHoverProvider implements HoverProvider {
    provideHover(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Hover> {
        let host = new ParserHost();

        let map = host.getMap(document.getText());
        console.log(map);

        return null;
    }
}