const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { scanWorkspace } = require('./src/core/workspaceScanner');

function getFileHash(filePath) {
    const content = fs.readFileSync(filePath);
    return crypto
        .createHash('sha256')
        .update(content)
        .digest('hex');
}

function activate(context) {

        scanWorkspace()
        .then(files => {
            console.log('CodeImpact workspace files:');
            console.log(files);
        })
        .catch(error => {
            console.error('Workspace scan failed:', error);
        });

    const command = vscode.commands.registerCommand(
        'codeimpact.findImpact',
        async function () {

            // Folder containing the Java test files
            const demoFolder = path.join(
                context.extensionPath,
                'markstest'
            );

            if (!fs.existsSync(demoFolder)) {
                vscode.window.showErrorMessage(
                    `Folder not found: ${demoFolder}`
                );
                return;
            }

            // Get Java files
            const files = fs.readdirSync(demoFolder)
                .filter(file => file.endsWith('.java'));

            if (files.length === 0) {
                vscode.window.showInformationMessage(
                    'No Java files found.'
                );
                return;
            }

            // --------------------------------------------------
            // 1. CHECK FOR CHANGES
            // --------------------------------------------------

            const baselinePath = path.join(
                demoFolder,
                '.codeimpact-baseline.json'
            );

            const currentHashes = {};

            for (const file of files) {
                currentHashes[file] = getFileHash(
                    path.join(demoFolder, file)
                );
            }

            // First time: create baseline
            if (!fs.existsSync(baselinePath)) {

                fs.writeFileSync(
                    baselinePath,
                    JSON.stringify(currentHashes, null, 2)
                );

                vscode.window.showInformationMessage(
                    'Baseline created. No Java file changes detected.'
                );

                return;
            }

            // Read previous baseline
            let oldHashes = {};

            try {
                oldHashes = JSON.parse(
                    fs.readFileSync(
                        baselinePath,
                        'utf8'
                    )
                );
            } catch {
                oldHashes = {};
            }

            // Find changed files
            const changedFiles = files.filter(file => {

                return (
                    oldHashes[file] !== currentHashes[file]
                );

            });

            // No changes
            if (changedFiles.length === 0) {

                vscode.window.showInformationMessage(
                    'No Java file changes detected.'
                );

                return;
            }

            // --------------------------------------------------
            // 2. SHOW ONLY CHANGED FILES
            // --------------------------------------------------

            const changedFile = await vscode.window.showQuickPick(
                changedFiles,
                {
                    placeHolder:
                        'Select the Java file you changed'
                }
            );

            if (!changedFile) {
                return;
            }

            // --------------------------------------------------
            // 3. BUILD DEPENDENCY GRAPH
            // --------------------------------------------------

            const dependencies = {};

            for (const file of files) {

                dependencies[file] = [];

                const content = fs.readFileSync(
                    path.join(demoFolder, file),
                    'utf8'
                );

                for (const otherFile of files) {

                    if (file === otherFile) {
                        continue;
                    }

                    const otherContent = fs.readFileSync(
                        path.join(demoFolder, otherFile),
                        'utf8'
                    );

                    // Find class name
                    const classMatch = otherContent.match(
                        /\bclass\s+([A-Za-z_$][\w$]*)/
                    );

                    if (!classMatch) {
                        continue;
                    }

                    const className = classMatch[1];

                    // Does current file use that class?
                    const classPattern = new RegExp(
                        `\\b${className}\\b`
                    );

                    if (classPattern.test(content)) {
                        dependencies[file].push(otherFile);
                    }
                }
            }

            // --------------------------------------------------
            // 4. FIND DIRECT + INDIRECT IMPACT
            // --------------------------------------------------

            const affected = new Set();

            const queue = [
                {
                    file: changedFile,
                    path: [changedFile]
                }
            ];

            const impactPaths = [];

            while (queue.length > 0) {

                const current = queue.shift();

                for (const file of files) {

                    if (
                        dependencies[file] &&
                        dependencies[file].includes(
                            current.file
                        ) &&
                        !affected.has(file)
                    ) {

                        affected.add(file);

                        const newPath = [
                            ...current.path,
                            file
                        ];

                        impactPaths.push(newPath);

                        queue.push({
                            file: file,
                            path: newPath
                        });
                    }
                }
            }

            // --------------------------------------------------
            // 5. DISPLAY RESULT
            // --------------------------------------------------

            const result = [];

            result.push(
                `Changed file: ${changedFile}`
            );

            result.push('');

            result.push(
                'Affected files:'
            );

            if (affected.size === 0) {

                result.push('None');

            } else {

                for (const file of affected) {
                    result.push(`• ${file}`);
                }

                result.push('');
                result.push('Impact paths:');

                for (const impactPath of impactPaths) {

                    result.push(
                        `• ${impactPath.join(' → ')}`
                    );
                }
            }

            vscode.window.showInformationMessage(
                result.join('\n'),
                { modal: true }
            );

            // --------------------------------------------------
            // 6. UPDATE BASELINE
            // --------------------------------------------------

            fs.writeFileSync(
                baselinePath,
                JSON.stringify(currentHashes, null, 2)
            );
        }
    );

    context.subscriptions.push(command);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};