import { datetime, diffInMin } from "https://deno.land/x/ptera/mod.ts";

import LogUtil from "./LogUtil.ts";
import StorageUtil, { IpsType } from "./StorageUtil.ts";

class IpsUtil {
  // class variables
  static DefaultIps: IpsType = {};

  // class methods
  static async create(id: string) {
    try {
      await StorageUtil.ids.updateOne({ id }, { $set: { ips: IpsUtil.DefaultIps } }, { upsert: true });
      return true;
    } catch (e) {
      LogUtil.error(e.message);
    }

    return false;
  }

  static async load(id: string) {
    try {
      const idDoc = await StorageUtil.ids.findOne({ id });
      if (idDoc) {
        const ips = idDoc.ips;
        if (ips) {
          return ips;
        }
      }
    } catch (e) {
      LogUtil.error(e.message);
    }

    return null;
  }

  static async save(id: string, ips: IpsType) {
    try {
      await StorageUtil.ids.updateOne({ id }, { $set: { ips } }, { upsert: true });
      return true;
    } catch (e) {
      LogUtil.error(e.message);
    }

    return false;
  }

  static async isIntervalOk(id: string, hostName: string, intervalMinutes: number) {
    const now = datetime();

    const ips = await IpsUtil.load(id);
    if (ips) {
      if (hostName in ips) {
        const preDt = datetime(new Date(ips[hostName]));
        const diff = diffInMin(now, preDt);
        if (diff < intervalMinutes) {
          return false;
        }
      }
    }

    const newIps = { ...ips, [hostName]: now.toISO() };
    await IpsUtil.save(id, newIps);
    return true;
  }
}

export default IpsUtil;
