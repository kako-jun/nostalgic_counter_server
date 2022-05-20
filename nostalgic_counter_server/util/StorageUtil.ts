import { MongoClient, Database, Collection, Document, Bson, ObjectId } from "https://deno.land/x/mongo/mod.ts";

import LogUtil from "./LogUtil.ts";

type IdType = {
  _id: ObjectId;
  id: string;
  secret?: SecretType;
  config?: ConfigType;
  counter?: CounterType;
  ips?: IpsType;
};

export type SecretType = {
  ciphered_password: string;
};

export type ConfigType = {
  interval_minutes: number;
  offset_count: number;
};

export type CounterType = {
  total: number;
  today: number;
  today_date: string;
  yesterday: number;
  yesterday_date: string;
  this_week: number;
  this_week_date: string;
  last_week: number;
  last_week_date: string;
  this_month: number;
  this_month_date: string;
  last_month: number;
  last_month_date: string;
  this_year: number;
  this_year_date: string;
  last_year: number;
  last_year_date: string;
};

export type IpsType = {
  [s: string]: string;
};

export type IgnoreType = {
  hostName: string;
};

class StorageUtil {
  // class variables
  static DefaultConfig: ConfigType = {
    interval_minutes: 0,
    offset_count: 0,
  };

  static db: Database;
  static ids: Collection<IdType>;
  static ignores: Collection<IgnoreType>;

  // class methods
  static async setup() {
    const client = new MongoClient();
    console.log("client", client);
    await client.connect(
      `mongodb+srv://kako-jun:${Deno.env.get(
        "NOSTALGIC_COUNTER_SERVER_DB_PASS"
      )}@cluster0.yckge.mongodb.net/?authMechanism=SCRAM-SHA-1`
    );

    StorageUtil.db = client.database("root");
    StorageUtil.ids = StorageUtil.db.collection<IdType>("ids");
    StorageUtil.ignores = StorageUtil.db.collection<IgnoreType>("ignores");
  }

  static async idExists(id: string) {
    try {
      const idDoc = await StorageUtil.ids.findOne({ id });
      if (idDoc) {
        return true;
      }
    } catch (e) {
      LogUtil.error(e.message);
    }

    return false;
  }
}

export default StorageUtil;
