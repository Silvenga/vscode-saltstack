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

    public stripDocument(document: string): string {
        let jinjaDirectives = /\{[#%][\w\W]*?[#%]\}/g;
        return document.replace(jinjaDirectives,
            // Find all Jinja directives, then replace all non-new lines with empty
            x => x.replace(/./g, ""));
    }

    public getYaml(document: string) {
        return yaml.safeLoad(document, {}) as YamlMap;
    }

    public mapFile(document: string): StateFile {

        let strippedDocument = this.stripDocument(document);
        var root = this.getYaml(strippedDocument);
        let file = new StateFile();
        file.startIndex = root.startPosition;
        file.endIndex = root.endPosition;

        for (let branch of root.mappings) {
            let declaration = this.mapDeclaration(branch, file);
            file.declarations.push(declaration);
        }

        return file;
    }

    private mapDeclaration(root: YAMLMapping, file: StateFile): StateDeclaration {
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
        for (let item of list.items) {
            let argument = this.mapArgument(item as YamlMap, func);
            func.arguments.push(argument);
        }

        return func;
    }

    private mapArgument(root: YamlMap, func: StateFunction): StateFunctionArgument {
        let argument = new StateFunctionArgument();

        argument.name = root.mappings[0].key.value;
        argument.startIndex = root.mappings[0].key.startPosition;
        argument.endIndex = root.mappings[0].key.endPosition;
        argument.function = func;

        argument.value = this.mapArgumentValue(root.mappings[0].value, argument);

        return argument;
    }

    private mapArgumentValue(root: YAMLNode, arg: StateFunctionArgument): StateFunctionArgumentValue {
        var value = new StateFunctionArgumentValue();
        value.value = root.value;
        value.startIndex = root.startPosition;
        value.endIndex = root.endPosition;
        value.argument = arg;
        return value;
    }

    public flatten(root: StateNode): StateNode[] {
        if (root.childrenNodes.length == 0) {
            return [root];
        }
        let children = root.childrenNodes
            .map(x => this.flatten(x))
            .reduce((pre, next) => pre.concat(next));
        return [root].concat(children);
    }
}
