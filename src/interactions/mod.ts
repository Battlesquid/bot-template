import { SlashCommandBuilder } from "@discordjs/builders";
import { ChannelType, PermissionsBitField, SlashCommandSubcommandBuilder } from "discord.js";

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

const enableLogging = new SlashCommandSubcommandBuilder()
  .setName("enable_logging")
  .setDescription("Enable a type of log")
  .addStringOption((opt) =>
    opt
      .setName("type")
      .setDescription("The type of log to enable")
      .addChoices(...[
        { name: "text", value: "text" },
        { name: "image", value: "image" },
      ])
      .setRequired(true)
  )
  .addChannelOption((opt) =>
    opt
      .setName("channel")
      .setDescription("The channel to send these logs to")
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true)
  );

const disableLogging = new SlashCommandSubcommandBuilder()
  .setName("disable_logging")
  .setDescription("Disable image logging")
  .addStringOption((opt) =>
    opt
      .setName("type")
      .setDescription("The type of log to disable")
      .addChoices(...[
        { name: "text", value: "text" },
        { name: "image", value: "image" },
      ])
      .setRequired(true)
  );

const mod = new SlashCommandBuilder()
  .setName("mod")
  .setDescription("Moderation commands.")
  .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
  .addSubcommand(timeout)
  .addSubcommand(enableLogging)
  .addSubcommand(disableLogging)
  .toJSON();

export default mod;