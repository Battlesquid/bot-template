import { ChatInputCommandInteraction } from "discord.js";
import ms from "ms";
import { ChatInputCommand } from ".";
import BotClient from "../client";

class ModTimeout extends ChatInputCommand {
  name = "mod";
  subcommand = "timeout";
  async execute(client: BotClient, inter: ChatInputCommandInteraction) {
    const user = inter.options.getUser("user", true);
    const duration = inter.options.getString("duration", true);
    const reason = inter.options.getString("reason", false) ?? undefined;

    try {
      const millis = ms(duration);
      const millisStr = ms(millis);

      if (millis < 0) {
        inter.reply("Duration must be a positive value");
        return;
      }

      if (millis > ms("28 days")) {
        inter.reply("Duration must be shorter than 28 days");
        return;
      }

      if (Number.isNaN(millis)) {
        inter.reply(`Invalid duration ${duration}`);
        return;
      }

      const member = await inter.guild?.members.fetch(user.id);
      if (!member) {
        inter.reply(`Unable to find ${user}, please try again later.`);
        return;
      }

      member
        .disableCommunicationUntil(Date.now() + millis, reason)
        .then(() => inter.reply({
          content: `Timed out ${user} for ${millisStr}`,
          ephemeral: true
        }))
        .catch((e) => {
          client.logger.error(e);
          inter.reply("An error occured, make sure I have permission");
        });
    } catch (e) {
      client.logger.error(e);
      inter.reply("An invalid duration was provided.");
    }
  }
}

export default new ModTimeout();
