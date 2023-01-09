import { Events, Interaction } from "discord.js";
import { Event } from ".";
import BotClient from "../client";

const event: Event<Events.InteractionCreate> = {
  name: Events.InteractionCreate,
  handle: async (client: BotClient, inter: Interaction) => {
    if (inter.isCommand()) {
      client.runCommand(inter);
    }
  },
};

export default event;
