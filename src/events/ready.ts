import { Event } from ".";

const event: Event<"ready"> = {
    name: "ready",
    once: true,
    handle(_client, _baseClient) {
        console.log("bot online")
    }
};

export default event;
