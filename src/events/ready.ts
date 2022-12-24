import { Event } from ".";

const event: Event<"ready"> = {
    name: "ready",
    once: true,
    handle(client) {
        client.logger.info("bot online.");
    }
};

export default event;
