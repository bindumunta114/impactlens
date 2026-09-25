/**
 * Finds files affected by a changed file.
 *
 * The dependency graph stores:
 *
 * file -> files it depends on
 *
 * For impact analysis, we need to travel in the
 * opposite direction:
 *
 * dependency -> files that depend on it
 */
function findImpact(graph, changedFile) {
    const affected = new Set();
    const impactPaths = [];

    const queue = [
        {
            file: changedFile,
            path: [changedFile]
        }
    ];

    while (queue.length > 0) {
        const current = queue.shift();

        const dependents = graph.getDependents(current.file);

        for (const dependent of dependents) {
            if (affected.has(dependent)) {
                continue;
            }

            affected.add(dependent);

            const newPath = [
                ...current.path,
                dependent
            ];

            impactPaths.push(newPath);

            queue.push({
                file: dependent,
                path: newPath
            });
        }
    }

    return {
        changedFile,
        affectedFiles: Array.from(affected),
        impactPaths
    };
}

module.exports = {
    findImpact
};