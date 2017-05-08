'use strict';
import { ExtensionContext, commands, languages, TextDocument, Range } from 'vscode';
import { FunctionDefinitionHoverProvider } from "./providers/functionDefinitionHoverProvider"

export async function activate(context: ExtensionContext) {

    console.log('SLS support now active!');
    context.subscriptions.push(languages.registerHoverProvider("sls", new FunctionDefinitionHoverProvider()))
}

export function deactivate() {
}