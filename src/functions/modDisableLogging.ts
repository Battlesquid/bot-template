import { ChatInputCommandInteraction } from "discord.js";
import BotClient from '../client';
import LoggingSettings from "../entities/LoggingSettings";
import { ChatInputCommand } from '../functions';

const command: ChatInputCommand = {
    type: "chat_input",
    name: "mod",
    subcommand: "disable_logging",
    execute: async (client: BotClient, inter: ChatInputCommandInteraction) => {
        const type = inter.options.getString("type", true);

        const em = client.orm.em.fork();
        const settings = await em.findOne(LoggingSettings, {
            guild_id: inter.guildId
        });

        if (!settings) {
            inter.reply("Logging must be enabled first.");
            return;
        }

        type === "text"
            ? settings.txt_log = null
            : settings.img_log = null;

        if (settings.img_log === null && settings.txt_log === null) {
            em.removeAndFlush(settings);
        } else {
            em.flush();
        }

        inter.reply(`Disabled ${type} logging.`);
    }
};

export default command;
