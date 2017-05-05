import test from 'ava';
import { expect } from 'chai';
import { ParserHost } from "../../src/parser/parserHost"

test('When stripping document, keep lines', t => {

    let host = new ParserHost();
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

    let host = new ParserHost();
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