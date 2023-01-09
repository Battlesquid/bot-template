import path from "path";
import dotenv from "dotenv";
import { expand } from "dotenv-expand";
const env = dotenv.config({ path: path.resolve(__dirname, "../.env") });
expand(env);

import { ActivityType, IntentsBitField } from "discord.js";
import BotClient from "./client";

const client = new BotClient({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent
  ],
  presence: {
    status: "online",
    activities: [{
      type: ActivityType.Watching,
      name: "for commands."
    }]
  }
});

client.start();
