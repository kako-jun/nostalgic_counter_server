import { Bson, MongoClient, ObjectId } from "https://deno.land/x/mongo/mod.ts";

import LogUtil from "./LogUtil.ts";

type ConfigType = {
  interval_minutes: number;
  offset_count: number;
};

class StorageUtil {
  // class variables
  static DefaultConfig: ConfigType = {
    interval_minutes: 0,
    offset_count: 0,
  };

  static rootPath = "";

  // class methods
  static async setup() {
    const client = new MongoClient();
    console.log("client", client);
    await client.connect(
      "mongodb+srv://kako-jun:vGUO56jAkijDx5qa@cluster0.vunss.mongodb.net/myFirstDatabase?authMechanism=SCRAM-SHA-1&retryWrites=true&w=majority"
    );

    console.log("client", client);

    type UserSchema = {
      _id: ObjectId;
      username: string;
      password: string;
    };

    const db = client.database("test");
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
}

export default StorageUtil;
