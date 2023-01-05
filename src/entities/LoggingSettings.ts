import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Snowflake } from "discord.js";

@Entity()
export default class LoggingSettings {
    @PrimaryKey({ columnType: "varchar" })
    guildId!: Snowflake;

    @Property({ columnType: "varchar", nullable: true })
    textLog: Snowflake | null;

    @Property({ columnType: "varchar", nullable: true })
    imageLog: Snowflake | null;

    constructor(
        guild: Snowflake,
        textLog: Snowflake | null,
        imageLog: Snowflake | null
    ) {
        this.guildId = guild;
        this.textLog = textLog;
        this.imageLog = imageLog;
    }
}
