const LANGUAGE_MAP = {
    '.java': 'java',
    '.py': 'python',
    '.c': 'c',
    '.cpp': 'cpp',
    '.h': 'c',
    '.hpp': 'cpp',
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.html': 'html',
    '.css': 'css'
};

function detectLanguage(filePath) {
    const extension = filePath
        .slice(filePath.lastIndexOf('.'))
        .toLowerCase();

    return LANGUAGE_MAP[extension] || 'unknown';
}

module.exports = {
    detectLanguage
};