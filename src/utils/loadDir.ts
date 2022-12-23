import fs from "fs/promises";

export default async (path: string) => {
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
