import { Entity, Property } from "@mikro-orm/core";
import { Snowflake } from "discord.js";
import BaseSettings from "./BaseSettings";

@Entity()
export default class LoggingSettings extends BaseSettings {
  @Property({ columnType: "varchar", nullable: true })
    txt_log: Snowflake | null;

  @Property({ columnType: "varchar", nullable: true })
    img_log: Snowflake | null;

  constructor(
    guild_id: Snowflake,
    txt_log: Snowflake | null,
    img_log: Snowflake | null
  ) {
    super(guild_id);
    this.txt_log = txt_log;
    this.img_log = img_log;
  }
}
