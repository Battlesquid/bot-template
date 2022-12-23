import {
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder
} from "discord.js";
import loadDir from "../utils/loadDir";
import path from "path";

export type Interaction =
    | SlashCommandBuilder
    | SlashCommandSubcommandBuilder
    | SlashCommandSubcommandGroupBuilder;

export default async () => {
    const dir = await loadDir(__dirname);
    const promises = dir.files.map(async (file) => {
        const filepath = path.resolve(__dirname, file);
        const interaction: Interaction = (await import(filepath)).default;
        return interaction.toJSON();
    });
    return Promise.all(promises);
}
