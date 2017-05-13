import * as yaml from "yaml-ast-parser"
import { YAMLDocument, YAMLNode, YAMLScalar, YAMLMapping, YamlMap, YAMLSequence, YAMLAnchorReference, Kind } from "yaml-ast-parser"

import { StateFile } from "./models/stateFile"
import { StateNode } from "./models/stateNode"
import { StateDeclaration } from "./models/stateDeclaration"
import { StateParser } from "./stateParser"
import { IncludeParser } from "./includeParser"

export class FileParser {

    private stateParser: StateParser = new StateParser();
    private includeParser: IncludeParser = new IncludeParser();

    public stripDocument(document: string): string {
        let jinjaDirectives = /\{[#%][\w\W]*?[#%]\}/g;
        return document.replace(jinjaDirectives, x => x.replace(/./g, " "));
    }

    public getYaml(document: string) {
        return yaml.safeLoad(document, {}) as yaml.YamlMap;
    }

    public mapFile(document: string): StateFile {

        let strippedDocument = this.stripDocument(document);
        var root = this.getYaml(strippedDocument);
        let file = new StateFile();
        file.startIndex = root.startPosition;
        file.endIndex = root.endPosition;

        for (let branch of root.mappings) {
            if (branch.value.kind == Kind.MAP) {
                let declaration = this.stateParser.mapDeclaration(branch, file);
                file.declarations.push(declaration);
            } else if (branch.value.kind == Kind.SEQ && branch.key.value == "include") {
                let include = this.includeParser.mapInclude(branch, file);
                file.include = include;
            }
        }
        return file;
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