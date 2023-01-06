import { ChatInputCommandInteraction } from "discord.js";
import { ChatInputCommand } from '.';
import BotClient from '../client';
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
        let settings = await em.findOne(LoggingSettings, {
            guild_id: inter.guildId
        });

        if (!settings) {
            settings = type === "text"
                ? new LoggingSettings(inter.guildId, ch.id, null)
                : new LoggingSettings(inter.guildId, null, ch.id);
            em.persistAndFlush(settings);
        } else {
            type === "text"
                ? settings.txt_log = ch.id
                : settings.img_log = ch.id
            em.flush();
        }

        inter.reply(`Enabled ${type} logging.`);
    }
}

export default new ModEnableLogging();
