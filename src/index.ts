import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") })

import { ActivityType, IntentsBitField } from "discord.js";
import BotClient from "./client";
import config from "./utils/config";

const client = new BotCl
ient({
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

client.start(config("DISCORD_TOKEN"));
