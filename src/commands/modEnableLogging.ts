import { ChatInputCommandInteraction } from "discord.js";
import { ChatInputCommand } from ".";
import BotClient from "../client";
import LoggingSettings from "../entities/LoggingSettings";

class ModEnableLogging extends ChatInputCommand {
  name = "mod";
  subcommand = "enable_logging";
  async execute(client: BotClient, inter: ChatInputCommandInteraction) {
    if (!inter.guildId) {
      inter.reply("An unexpected error occured.");
      return;
    }

    const ch = inter.options.getChannel("channel", true);
    const type = inter.options.getString("type", true);
    const em = client.orm.em.fork();

    if (type === "text") {
      em.upsert(LoggingSettings, {
        guild_id: inter.guildId,
        txt_log: ch.id
      });
    } else {
      em.upsert(LoggingSettings, {
        guild_id: inter.guildId,
        img_log: ch.id
      });
    }

    inter.reply(`Enabled ${type} logging.`);
  }
}

export default new ModEnableLogging();
