import { Entity, PrimaryKey } from "@mikro-orm/core";
import { Snowflake } from "discord.js";

@Entity()
export default class BaseSettings {
  @PrimaryKey({ columnType: "varchar" })
    guild_id!: Snowflake;

  constructor(guild_id: Snowflake) {
    this.guild_id = guild_id;
  }
}
