import { Events } from "discord.js";
import { Event } from ".";

const event: Event<Events.ClientReady> = {
  name: Events.ClientReady,
  once: true,
  async handle(client) {
    client.logger.info("bot online.");
  }
};

export default event;
