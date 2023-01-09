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

export default async () => loadDirAs<Interaction>(__dirname);
