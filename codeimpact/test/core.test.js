const assert = require('assert');
const { describe, it } = require('mocha');
const vscode = require('vscode');

const {
    analyzeWorkspace
} = require('../src/core/workspaceAnalyzer');

const {
    DependencyGraph
} = require('../src/core/dependencyGraph');

const {
    findImpact
} = require('../src/core/impactAnalyzer');

describe('Dependency Graph and Impact Analyzer', function () {

    it('should find direct and indirect affected files', function () {

        const graph = new DependencyGraph();

        graph.addDependency(
            'service.py',
            'database.py'
        );

        graph.addDependency(
            'app.py',
            'service.py'
        );

        const result = findImpact(
            graph,
            'database.py'
        );

        assert.deepStrictEqual(
            result.affectedFiles,
            [
                'service.py',
                'app.py'
            ]
        );
    });

   it('should detect languages in workspace files', async function () {

    const workspaceFolder = vscode.workspace.workspaceFolders;

    assert.ok(workspaceFolder);

    const files = await analyzeWorkspace();

    assert.ok(Array.isArray(files));

    for (const file of files) {
        assert.ok(file.language);
    }
});
it('should analyze C file dependencies and functions', function () {
    const { analyzeCFile } = require('../src/analyzers/cAnalyzer');

    const content = `
        #include <stdio.h>
        #include "database.h"

        void calculate() {
        }
    `;

    const result = analyzeCFile('main.c', content);

    assert.deepStrictEqual(
        result.dependencies,
        ['stdio.h', 'database.h']
    );

    assert.deepStrictEqual(
        result.symbols,
        ['calculate']
    );
});
});