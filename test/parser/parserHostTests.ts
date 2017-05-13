import test from 'ava';
import { expect } from 'chai';
import { FileParser } from "../../src/parser/fileParser"

test('When stripping document, keep lines', t => {

    let host = new FileParser();
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

    let host = new FileParser();
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

test('When stripping document, escape jinja content.', t => {

    let host = new FileParser();
    const document =
        `
{{ test }}
`;

    // Act
    let result = host.stripDocument(document);

    // Assert
    t.is(result.trim(), "'{ test }'");
});