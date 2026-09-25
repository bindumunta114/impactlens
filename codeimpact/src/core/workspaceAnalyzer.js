const { scanWorkspace } = require('./workspaceScanner');
const { detectLanguage } = require('./languageDetector');

/**
 * Scans the workspace and assigns a language
 * to every supported source file.
 */
async function analyzeWorkspace() {
    const files = await scanWorkspace();

    return files.map(file => ({
        ...file,
        language: detectLanguage(file.path)
    }));
}

module.exports = {
    analyzeWorkspace
};