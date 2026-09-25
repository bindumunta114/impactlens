/**
 * Creates the standard result structure returned by
 * every language analyzer.
 */
function createAnalysisResult(filePath, language) {
    return {
        filePath,
        language,
        symbols: [],
        dependencies: [],
        references: []
    };
}

module.exports = {
    createAnalysisResult
};