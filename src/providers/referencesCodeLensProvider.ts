import { CodeLensProvider, CodeLens, TextDocument, CancellationToken, Range, window, Command } from 'vscode';
import { FileParser } from "../parser/fileParser"
import { StateFile } from "../parser/models/stateFile"
import { StateNode } from "../parser/models/stateNode"
import { StateInclude, StateIncludeReference } from "../parser/models/stateInclude"
import { StateDeclaration, StateFunction, StateFunctionArgument, StateFunctionArgumentValue } from "../parser/models/stateDeclaration"

export class ReferencesCodeLensProvider implements CodeLensProvider {
    public provideCodeLenses(document: TextDocument, token: CancellationToken): CodeLens[] {
        let host = new FileParser();
        let map = host.mapFile(document.getText());
        let nodes = host.flatten(map);
        let functions = nodes
            .filter(x => x instanceof StateFunction)
            .map(x => <StateFunction>x);

        return functions.map(x => {
            let start = document.positionAt(x.startIndex);
            let end = document.positionAt(x.endIndex);
            let refs = functions.filter(c => c.references.find(b => x.ids.find(v => v == b) != null))
            let title = `${refs.length} ${refs.length == 1 ? "reference" : "references"}`;
            let lens = new CodeLens(new Range(start, end), { title: title, command: null });

            return lens;
        });
    }

    // public resolveCodeLens?(codeLens: CodeLens, token: CancellationToken): CodeLens {

    // }
}
