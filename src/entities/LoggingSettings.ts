import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Snowflake } from "discord.js";

@Entity()
export default class LoggingSettings {
    @PrimaryKey({ columnType: "varchar" })
    guild_id!: Snowflake;

    @Property({ columnType: "varchar", nullable: true })
    txt_log: Snowflake | null;

    @Property({ columnType: "varchar", nullable: true })
    img_log: Snowflake | null;

    constructor(
        guild_id: Snowflake,
        txt_log: Snowflake | null,
        img_log: Snowflake | null
    ) {
        this.guild_id = guild_id;
        this.txt_log = txt_log;
        this.img_log = img_log;
    }
}
