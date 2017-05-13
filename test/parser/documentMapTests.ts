import test from 'ava';
import { expect } from 'chai';
import { FileParser } from "../../src/parser/fileParser"

test('Can parse single declaration', t => {

    let host = new FileParser();
    const document =
        `
/etc/postfix:
  file.directory:
    - user: root
    - group: root
    - dir_mode: 755
    - file_mode: 644
    - makedirs: True
`;

    // Act
    let result = host.mapFile(document);

    // Assert
    t.is(result.declarations.length, 1);
    t.is(result.declarations[0].startIndex, 1);
    t.is(result.declarations[0].endIndex, 13);
    t.is(result.declarations[0].file, result);
});

test('Can parse when jinja statements are present.', t => {

    let host = new FileParser();
    const document =
        `
test1:
  file.directory:
    - name: something
{% set some = true %}
test2:
  file.directory:
    - name: something
`;

    // Act
    let result = host.mapFile(document);

    // Assert
    t.is(result.declarations.length, 2);
    t.deepEqual(result.declarations.map(x => x.id), ["test1", "test2"]);
});

test('Can parse function.', t => {

    let host = new FileParser();
    const document =
        `
/etc/postfix:
  file.directory:
    - user: root
    - group: root
    - dir_mode: 755
    - file_mode: 644
    - makedirs: True
`;

    // Act
    let result = host.mapFile(document);

    // Assert
    t.is(result.declarations[0].functions.length, 1);
    t.is(result.declarations[0].functions[0].name, "file.directory");
    t.is(result.declarations[0].functions[0].startIndex, 17);
    t.is(result.declarations[0].functions[0].endIndex, 31);
    t.is(result.declarations[0].functions[0].declaration, result.declarations[0]);
});



test('Can parse argument.', t => {

    let host = new FileParser();
    const document =
        `
/etc/postfix:
  file.directory:
    - user: root
    - group: root
    - dir_mode: 755
    - file_mode: 644
    - makedirs: True
`;

    // Act
    let result = host.mapFile(document);

    // Assert
    t.is(result.declarations[0].functions[0].arguments.length, 5);
    t.is(result.declarations[0].functions[0].arguments[0].name, "user");
    t.is(result.declarations[0].functions[0].arguments[0].values[0].value, "root");
    t.is(result.declarations[0].functions[0].arguments[0].startIndex, 39);
    t.is(result.declarations[0].functions[0].arguments[0].endIndex, 43);
    t.is(result.declarations[0].functions[0].arguments[0].function, result.declarations[0].functions[0]);
});


test('Can parse argument value.', t => {

    let host = new FileParser();
    const document =
        `
/etc/postfix:
  file.directory:
    - user: root
    - group: root
    - dir_mode: 755
    - file_mode: 644
    - makedirs: True
`;

    // Act
    let result = host.mapFile(document);

    // Assert
    t.is(result.declarations[0].functions[0].arguments[0].values[0].value, "root");
    t.is(result.declarations[0].functions[0].arguments[0].values[0].startIndex, 45);
    t.is(result.declarations[0].functions[0].arguments[0].values[0].endIndex, 49);
    t.is(result.declarations[0].functions[0].arguments[0].values[0].argument, result.declarations[0].functions[0].arguments[0]);
});

test('Can parse multiple argument values.', t => {

    let host = new FileParser();
    const document =
        `
/etc/postfix:
  file.directory:
    - user: 
      - root
`;

    // Act
    let result = host.mapFile(document);

    // Assert
    t.is(result.declarations[0].functions[0].arguments[0].values[0].value, "root");
    t.is(result.declarations[0].functions[0].arguments[0].values[0].startIndex, 54);
    t.is(result.declarations[0].functions[0].arguments[0].values[0].endIndex, 58);
    t.is(result.declarations[0].functions[0].arguments[0].values[0].argument, result.declarations[0].functions[0].arguments[0]);
});

test('Can parse include.', t => {

    let host = new FileParser();
    const document =
        `
include:
  - postfix
`;

    // Act
    let result = host.mapFile(document);

    // Assert
    t.is(result.include.startIndex, 1);
    t.is(result.include.endIndex, 8);
    t.is(result.include.file, result);
});


test('Can parse include refs.', t => {

    let host = new FileParser();
    const document =
        `
include:
  - postfix
`;

    // Act
    let result = host.mapFile(document);

    // Assert
    t.deepEqual(result.include.references[0].reference, "postfix");
    t.is(result.include.references[0].startIndex, 14);
    t.is(result.include.references[0].endIndex, 21);
    t.is(result.include.references[0].include, result.include);
});

