import test from 'ava';
import { expect } from 'chai';
import { FileParser } from "../../src/parser/fileParser"

test('When include does not exist, dont error.', t => {

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
    let flattened = host.flatten(result);

    // Assert
    t.pass();
});

test('When include does exist, dont error.', t => {

    let host = new FileParser();
    const document =
        `
include:
  - something
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
    let flattened = host.flatten(result);

    // Assert
    t.pass();
});

test('When include does exist, dont error.', t => {

    let host = new FileParser();
    const document =
        `
pep8:
  pip_state.installed:
    - require:
      - cmd: python-pip
`;

    // Act
    let result = host.mapFile(document);
    let flattened = host.flatten(result);

    // Assert
    t.pass();
});