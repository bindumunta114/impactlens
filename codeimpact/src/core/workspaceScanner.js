const vscode = require('vscode');
const path = require('path');

const SOURCE_FILE_PATTERN =
    '**/*.{java,py,c,cpp,h,hpp,js,jsx,ts,tsx,html,css}';

const EXCLUDE_PATTERN =
    '**/{node_modules,.git,dist,build,target,out,__pycache__}/**';

/**
 * Finds source files inside the currently opened VS Code workspace.
 */
async function scanWorkspace() {

    if (!vscode.workspace.workspaceFolders) {
        throw new Error('No VS Code workspace is currently open.');
    }

    const uris = await vscode.workspace.findFiles(
        SOURCE_FILE_PATTERN,
        EXCLUDE_PATTERN
    );

    return uris.map(uri => ({
        uri,
        path: uri.fsPath,
        fileName: path.basename(uri.fsPath),
        extension: path.extname(uri.fsPath).toLowerCase()
    }));
}

module.exports = {
    scanWorkspace
};