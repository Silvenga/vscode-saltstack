'use strict';
import { ExtensionContext, commands, languages, TextDocument, Range } from 'vscode';
import { FunctionDefinitionHoverProvider } from "./providers/functionDefinitionHoverProvider"
import { ReferencesCodeLensProvider } from "./providers/referencesCodeLensProvider"

export async function activate(context: ExtensionContext) {

    console.log('SLS support now active!');
    context.subscriptions.push(languages.registerHoverProvider("sls", new FunctionDefinitionHoverProvider()))
    context.subscriptions.push(languages.registerCodeLensProvider("sls", new ReferencesCodeLensProvider()))
}

export function deactivate() {
}