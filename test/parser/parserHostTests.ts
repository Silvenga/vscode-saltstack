import test from 'ava';
import { expect } from 'chai';
import { StateParser } from "../../src/parser/stateParser"

test('When stripping document, keep lines', t => {

    let host = new StateParser();
    const document =
        `
{% test 
        %}
normal:
  - yaml
`;

    // Act
    let result = host.stripDocument(document);

    // Assert
    t.is(result.split(/\r?\n/).length, 6);
});

test('When stripping document, remove jinja statements', t => {

    let host = new StateParser();
    const document =
        `
{% test 
        %}
normal:
`;

    // Act
    let result = host.stripDocument(document);

    // Assert
    t.is(result.trim(), "normal:");
});