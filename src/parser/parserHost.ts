import * as yaml from "js-yaml"

export class ParserHost {

    public stripDocument(document: string): string {
        var jinjaDirectives = /\{[#%][\w\W]*?[#%]\}/g;
        return document.replace(jinjaDirectives,
            // Find all Jinja directives, then replace all non-new lines with empty
            x => x.replace(/./g, ""));
    }

    public getYaml(document: string): any {
        var doc = yaml.safeLoad(document, yaml.JSON_SCHEMA);
        return doc;
    }
}