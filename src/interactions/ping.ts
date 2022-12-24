import { SlashCommandBuilder } from "@discordjs/builders";

export default new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pong.")
    .toJSON();
