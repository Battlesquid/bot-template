import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql"
import config from "../utils/config"

export default async () => {
    return MikroORM.init<PostgreSqlDriver>({
        dbName: config("DISCORD_BOT_NAME"),
        entities: ["./dist/entities"],
        entitiesTs: ["./src/entities"],
        clientUrl: config("DATABASE_URL"),
        type: "postgresql",
        pool: {min: 0, max: 5} // https://github.com/nodejs/help/issues/2494
    });
}
