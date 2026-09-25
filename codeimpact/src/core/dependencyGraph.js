class DependencyGraph {
    constructor() {
        this.graph = new Map();
    }

    addFile(filePath) {
        if (!this.graph.has(filePath)) {
            this.graph.set(filePath, new Set());
        }
    }

    addDependency(filePath, dependencyPath) {
        this.addFile(filePath);
        this.addFile(dependencyPath);

        this.graph.get(filePath).add(dependencyPath);
    }

    getDependencies(filePath) {
        if (!this.graph.has(filePath)) {
            return [];
        }

        return Array.from(this.graph.get(filePath));
    }

    getDependents(filePath) {
        const dependents = [];

        for (const [file, dependencies] of this.graph.entries()) {
            if (dependencies.has(filePath)) {
                dependents.push(file);
            }
        }

        return dependents;
    }

    getAllFiles() {
        return Array.from(this.graph.keys());
    }
}

module.exports = {
    DependencyGraph
};