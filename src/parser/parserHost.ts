import * as yaml from "js-yaml"

export class ParserHost {

    public document: string;

    constructor(document: string) {
        this.document = document;
    }

    public stripDocument(): string {
        var jinjaDirectives = /\{[#%][\w\W]*?[#%]\}/g;
        this.document.replace(jinjaDirectives, "");
    }

    public getYaml(): any {
        var doc = yaml.safeLoad(this.document, yaml.JSON_SCHEMA);
        return doc;
    }
}