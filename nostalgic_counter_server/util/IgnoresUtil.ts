import LogUtil from "./LogUtil.ts";
import CommonUtil from "./CommonUtil.ts";
import StorageUtil, { IgnoreType } from "./StorageUtil.ts";

class IgnoresUtil {
  // class variables
  static DefaultIgnore: IgnoreType = {
    hostName: "",
  };

  // class methods
  static async setup() {
    // ignoresがなければ作る
    await IgnoresUtil.create();
  }

  static async create() {
    try {
      await StorageUtil.ignores.updateOne(
        {},
        { $set: { hostName: IgnoresUtil.DefaultIgnore.hostName } },
        { upsert: true }
      );
      return true;
    } catch (e) {
      LogUtil.error(e.message);
    }

    return false;
  }

  static async isIgnoreHostName(hostName: string) {
    try {
      const idDoc = await StorageUtil.ignores.findOne({ hostName });
      if (idDoc) {
        return true;
      }
    } catch (e) {
      LogUtil.error(e.message);
    }

    return false;
  }
}

export default IgnoresUtil;
