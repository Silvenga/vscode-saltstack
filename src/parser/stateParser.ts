import { StateDeclaration, StateFunction, StateFunctionArgument, StateFunctionArgumentValue } from "./models/stateDeclaration"
import { StateFile } from "./models/stateFile"
import { StateNode } from "./models/stateNode"

import * as yaml from "yaml-ast-parser"
import { YAMLDocument, YAMLNode, YAMLScalar, YAMLMapping, YamlMap, YAMLSequence, YAMLAnchorReference, Kind } from "yaml-ast-parser"


//     SCALAR = 0,
//     MAPPING = 1,
//     MAP = 2,
//     SEQ = 3,
//     ANCHOR_REF = 4,
//     INCLUDE_REF = 5,

const LineBreakRegex = /\r?\n/;

export class StateParser {

    public mapDeclaration(root: YAMLMapping, file: StateFile): StateDeclaration {
        let declaration = new StateDeclaration();
        declaration.startIndex = root.key.startPosition;
        declaration.endIndex = root.key.endPosition;
        declaration.id = root.key.value;
        declaration.file = file;

        // TODO can value be a scalar?     
        if (root.value == null) {
            return declaration;
        }
        for (let map of root.value.mappings) {
            let func = this.mapFunction(map, declaration);
            declaration.functions.push(func);
        }
        return declaration;
    }

    private mapFunction(root: YAMLMapping, dec: StateDeclaration): StateFunction {
        let func = new StateFunction();
        func.name = root.key.value;
        func.startIndex = root.key.startPosition;
        func.endIndex = root.key.endPosition;
        func.declaration = dec;

        let list = root.value as YAMLSequence;
        if (list == null) {
            return func;
        }
        func.arguments = list.items.map(x => this.mapArgument(x as YamlMap, func));

        const referenceNames: string[] = [
            "require",
            "watch",
            "prereq",
            "use",
            "onchanges",
            "onfail",
            "require_in",
            "watch_in",
            "prereq_in",
            "use_in",
            "onchanges_in",
            "onfail_in"
        ];

        func.references = func.arguments
            .filter(x => referenceNames.findIndex(c => c == x.name) != -1)
            .map(x => x.values.map(c => c.value))
            .reduce((x, y) => x.concat(y), []);

        func.ids.push(dec.id);
        let nameArgument = func.arguments.find(x => x.name == "name");
        if (nameArgument != null) {
            func.ids.push(nameArgument.values.reduce((x, y) => x + y.value, ""));
        }

        let moduleNameParts = func.name.split(".");
        if (moduleNameParts.length == 2) {
            func.moduleName = moduleNameParts[0];
            func.moduleFunctionName = moduleNameParts[1];
            func.ids = func.ids.concat(func.ids.map(x => `${func.moduleName}: ${x}`))
        }

        return func;
    }

    private mapArgument(root: YamlMap, func: StateFunction): StateFunctionArgument {
        let argument = new StateFunctionArgument();

        argument.name = root.mappings[0].key.value;
        argument.startIndex = root.mappings[0].key.startPosition;
        argument.endIndex = root.mappings[0].key.endPosition;
        argument.function = func;

        argument.values = this.mapArgumentValue(root.mappings[0].value, argument);

        return argument;
    }

    private mapArgumentValue(root: YAMLNode, arg: StateFunctionArgument): Array<StateFunctionArgumentValue> {
        if (root.kind == Kind.SEQ) {
            let seq = root as YAMLSequence;
            var items = seq.items.map(x => this.mapArgumentValue(x, arg)).reduce((x, y) => x.concat(y));
            return items;
        } else if (root.kind == Kind.SCALAR) {
            var value = new StateFunctionArgumentValue();
            value.value = root.value;
            value.startIndex = root.startPosition;
            value.endIndex = root.endPosition;
            value.argument = arg;
            return [value];
        } else if (root.kind == Kind.MAP) {
            var value = new StateFunctionArgumentValue();
            value.startIndex = root.startPosition;
            value.endIndex = root.endPosition;
            let map = root as YamlMap;
            value.value = map.mappings.map(x => `${x.key.value}: ${x.value.value}`).reduce((x, y) => x + ", " + y);
            return [value];
        }
        else {
            console.warn("Unknown kind found", root.kind);
            var value = new StateFunctionArgumentValue();
            value.startIndex = root.startPosition;
            value.endIndex = root.endPosition;
            return [value];
        }
    }
}
