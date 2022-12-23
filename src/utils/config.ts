const VARIABLES = [
    "DISCORD_TOKEN",
    "DISCORD_CLIENT_ID"
];

const config: { [k: string]: string } = {};
VARIABLES.forEach((v) => {
    if (!process.env[v]) {
        console.error(`Environment variable '${v}' missing, exiting.`);
        process.exit();
    }
    config[v] = process.env[v]!;
});

export default (key: string) => config[key];
