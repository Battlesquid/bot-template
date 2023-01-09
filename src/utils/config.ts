const VARIABLES = [
  "DISCORD_TOKEN",
  "DISCORD_CLIENT_ID",
  "DISCORD_BOT_NAME",
  "DATABASE_URL"
] as const;

type ConfigVariable = typeof VARIABLES[number]

const config: { [k: string]: string } = {};
VARIABLES.forEach((v) => {
  if (!process.env[v]) {
    console.error(`Environment variable '${v}' missing, exiting.`);
    process.exit();
  }
  config[v] = process.env[v] as string;
});

export default (key: ConfigVariable) => config[key];
