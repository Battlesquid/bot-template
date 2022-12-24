import fs from "fs/promises";
import path from "path";

export const loadDir = async (path: string) => {
    const dir = await fs.readdir(path, { withFileTypes: true });
    const dirs: string[] = [];
    const files: string[] = [];
    dir.forEach((i) => {
        if (i.name.startsWith("index")) {
            return;
        }
        i.isDirectory()
            ? dirs.push(i.name)
            : files.push(i.name)
    });
    return { dirs, files };
};

export const loadDirAs = async<T>(path_: string) => {
    const dir = await loadDir(path_);
    const promises = dir.files.map(async (file) => {
        const filepath = path.resolve(path_, file);
        const module: T = (await import(filepath)).default;
        return module;
    });
    return Promise.all(promises);
}
