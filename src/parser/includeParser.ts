import { YAMLDocument, YAMLNode, YAMLScalar, YAMLMapping, YamlMap, YAMLSequence, YAMLAnchorReference, Kind } from "yaml-ast-parser"
import { StateFile } from "./models/stateFile"
import { StateNode } from "./models/stateNode"
import { StateInclude, StateIncludeReference } from "./models/stateInclude"

export class IncludeParser {
    public mapInclude(root: YAMLMapping, file: StateFile): StateInclude {
        let include = new StateInclude();
        include.startIndex = root.key.startPosition;
        include.endIndex = root.key.endPosition;
        include.file = file;

        if (root.value == null) {
            return include;
        }

        let seq = root.value as YAMLSequence;
        include.references = seq.items.map(x => this.mapReferences(x, include));

        return include;
    }

    private mapReferences(root: YAMLNode, include: StateInclude): StateIncludeReference {
        let ref = new StateIncludeReference();
        ref.startIndex = root.startPosition;
        ref.endIndex = root.endPosition;
        ref.reference = root.value;
        ref.include = include;
        return ref;
    }
}