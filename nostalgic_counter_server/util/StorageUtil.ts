import { Bson, MongoClient, Database, ObjectId } from "https://deno.land/x/mongo/mod.ts";

import LogUtil from "./LogUtil.ts";

type TableType = {
  ids: IdType[];
  ignore_list: IgnoreListType;
};

type IdType = {
  _id: ObjectId;
  id: string;
  secret: SecretType;
  config: ConfigType;
  counter: CounterType;
  ips: IpsType;
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

export type IgnoreListType = {
  host_list: string[];
};

class StorageUtil {
  // class variables
  static DefaultConfig: ConfigType = {
    interval_minutes: 0,
    offset_count: 0,
  };

  static db: Database;

  // class methods
  static async setup() {
    const client = new MongoClient();
    console.log("client", client);
    const db = await client.connect(
      "mongodb+srv://kako-jun:vGUO56jAkijDx5qa@cluster0.vunss.mongodb.net/test?authMechanism=SCRAM-SHA-1&retryWrites=true&w=majority"
    );

    console.log("db", db);

    type UserSchema = {
      _id: ObjectId;
      username: string;
      password: string;
    };

    // const db = client.database("test");
    const users = db.collection<UserSchema>("users");

    const insertId = await users.insertOne({
      username: "user1",
      password: "pass1",
    });

    const insertIds = await users.insertMany([
      {
        username: "user1",
        password: "pass1",
      },
      {
        username: "user2",
        password: "pass2",
      },
    ]);
  }

  static load(id: string) {}

  static save(id: string, value: any) {}
}

export default StorageUtil;
