import { EntityCaseNamingStrategy } from "@mikro-orm/core";
import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql"
import config from "../utils/config"

export default async () => {
    return MikroORM.init<PostgreSqlDriver>({
        type: "postgresql",
        dbName: config("DISCORD_BOT_NAME"),
        clientUrl: config("DATABASE_URL"),
        entities: ["./dist/entities"],
        entitiesTs: ["./src/entities"],
        namingStrategy: EntityCaseNamingStrategy,
        pool: {min: 0, max: 5} // https://github.com/nodejs/help/issues/2494
    });
}
