import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionsBitField, SlashCommandSubcommandBuilder } from "discord.js";

const timeout = new SlashCommandSubcommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user")
    .addUserOption((option) =>
        option
            .setName("user")
            .setDescription("The user to timeout")
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName("duration")
            .setDescription("How long this user should be timed out for.")
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName("reason")
            .setDescription("The reason for timing this user out")
    );

const mod = new SlashCommandBuilder()
    .setName("mod")
    .setDescription("Moderation commands.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    .addSubcommand(timeout);

export default mod;