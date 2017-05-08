import * as yaml from "yaml-ast-parser"
import { YAMLDocument, YAMLNode, YAMLScalar, YAMLMapping, YamlMap, YAMLSequence, YAMLAnchorReference, Kind } from "yaml-ast-parser"

//     SCALAR = 0,
//     MAPPING = 1,
//     MAP = 2,
//     SEQ = 3,
//     ANCHOR_REF = 4,
//     INCLUDE_REF = 5,

const LineBreakRegex = /\r?\n/;

export class ParserHost {

    public stripDocument(document: string): string {
        let jinjaDirectives = /\{[#%][\w\W]*?[#%]\}/g;
        return document.replace(jinjaDirectives,
            // Find all Jinja directives, then replace all non-new lines with empty
            x => x.replace(/./g, ""));
    }

    public getYaml(document: string) {
        return yaml.safeLoad(document, {}) as YamlMap;
    }

    public getMap(document: string): StateFile {

        let strippedDocument = this.stripDocument(document);

        var root = this.getYaml(document);
        let file = new StateFile();
        file.startIndex = root.startPosition;
        file.endIndex = root.endPosition;

        for (let branch of root.mappings) {
            let declaration = this.mapDeclaration(branch);
            file.declarations.push(declaration);
        }

        return file;
    }

    private mapDeclaration(root: YAMLMapping): StateDeclaration {
        let declaration = new StateDeclaration();
        declaration.startIndex = root.key.startPosition;
        declaration.endIndex = root.key.endPosition;
        declaration.id = root.key.value;

        // TODO can value be a scalar?     
        if (root.value == null) {
            return declaration;
        }
        for (let map of root.value.mappings) {
            let func = this.mapFunction(map);
            declaration.functions.push(func);
        }

        return declaration;
    }

    private mapFunction(root: YAMLMapping): StateFunction {
        let func = new StateFunction();
        func.name = root.key.value;
        func.startIndex = root.key.startPosition;
        func.endIndex = root.key.endPosition;

        let list = root.value as YAMLSequence;
        if (list == null) {
            return func;
        }
        for (let item of list.items) {
            let argument = this.mapArgument(item as YamlMap);
            func.arguments.push(argument);
        }

        return func;
    }

    private mapArgument(root: YamlMap): StateFunctionArgument {
        let argument = new StateFunctionArgument();

        argument.name = root.mappings[0].key.value;
        argument.value = root.mappings[0].value.value;
        argument.startIndex = root.startPosition;
        argument.endIndex = root.endPosition;

        return argument;
    }

    public flatten(root: StateNode): StateNode[] {
        if (root.childrenNodes.length == 0) {
            return [];
        }
        let children = root.childrenNodes
            .map(x => this.flatten(x))
            .reduce((pre, next) => pre.concat(next));
        return children;
    }
}

export abstract class StateNode {
    public startIndex: number;
    public endIndex: number;

    public abstract get childrenNodes(): StateNode[];
}

export class StateFile extends StateNode {
    public declarations: StateDeclaration[] = new Array<StateDeclaration>();
    public get childrenNodes(): StateNode[] {
        return this.declarations;
    }
}

export class StateDeclaration extends StateNode {
    public id: string;
    public functions: StateFunction[] = new Array<StateFunction>();
    public get childrenNodes(): StateNode[] {
        return this.functions;
    }
}

export class StateFunction extends StateNode {
    public name: string;
    public arguments: StateFunctionArgument[] = new Array<StateFunctionArgument>();
    public get childrenNodes(): StateNode[] {
        return this.arguments;
    }
}

export class StateFunctionArgument extends StateNode {
    public name: string;
    public value: string;
    public get childrenNodes(): StateNode[] {
        return [];
    }
}