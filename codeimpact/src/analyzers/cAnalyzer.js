const Parser = require('tree-sitter');
const C = require('tree-sitter-c');

const { createAnalysisResult } = require('./analyzerInterface');

function analyzeCFile(filePath, content) {
    const result = createAnalysisResult(filePath, 'c');

    const parser = new Parser();
    parser.setLanguage(C);

    const tree = parser.parse(content);

    function walk(node) {
        // Detect #include statements
        if (node.type === 'preproc_include') {
            const includeNode = node.childForFieldName('path');

            if (includeNode) {
                result.dependencies.push(
                    content.slice(includeNode.startIndex, includeNode.endIndex)
                        .replace(/^["<]|[">]$/g, '')
                );
            }
        }

        // Detect function definitions
        if (node.type === 'function_definition') {
            const declarator = node.childForFieldName('declarator');

            if (declarator) {
                const functionName = declarator.childForFieldName('declarator');

                if (functionName) {
                    result.symbols.push(
                        content.slice(
                            functionName.startIndex,
                            functionName.endIndex
                        )
                    );
                }
            }
        }

        for (const child of node.namedChildren) {
            walk(child);
        }
    }

    walk(tree.rootNode);

    return result;
}

module.exports = {
    analyzeCFile
};