import {
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder
} from "discord.js";
import { loadDirAs } from "../utils/loadDir";

export type Interaction =
    | SlashCommandBuilder
    | SlashCommandSubcommandBuilder
    | SlashCommandSubcommandGroupBuilder;

export default async () => {
    const modules = await loadDirAs<Interaction>(__dirname);
    return modules.map(m => m.toJSON());
}
