import {
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder
} from "discord.js";
import loadDir from "../utils/loadDir";

export type SlashCommandData = {
    name: string;
    subcommand?: string;
    group?: string;
};

export type SlashCommandFunction = SlashCommandData & {
    // execute: CommandExec;
};

export type SlashCommand =
    | SlashCommandBuilder
    | SlashCommandSubcommandBuilder
    | SlashCommandSubcommandGroupBuilder;


export default async () => {
    const dir = await loadDir(".");
    const promises = dir.files.map(async (file) => {
        const interaction: SlashCommand = (await import(file)).default;
    })
}
