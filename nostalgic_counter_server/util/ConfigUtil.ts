import LogUtil from "./LogUtil.ts";
import StorageUtil, { ConfigType } from "./StorageUtil.ts";

class ConfigUtil {
  // class variables
  static DefaultConfig: ConfigType = {
    interval_minutes: 0,
    offset_count: 0,
  };

  static async create(id: string) {
    try {
      await StorageUtil.ids.updateOne({ id }, { $set: { config: ConfigUtil.DefaultConfig } }, { upsert: true });
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
        const config = idDoc.config;
        LogUtil.debug("config", config);

        return { ...ConfigUtil.DefaultConfig, ...config };
      }
    } catch (e) {
      LogUtil.error(e.message);
    }

    return null;
  }

  static async save(id: string, intervalMinutes: number, offsetCount: number) {
    try {
      const config = await ConfigUtil.load(id);
      if (config) {
        const tempConfig: any = {};

        if (intervalMinutes >= 0) {
          tempConfig.interval_minutes = intervalMinutes;
        }

        if (offsetCount >= 0) {
          tempConfig.offset_count = offsetCount;
        }

        const newConfig = { ...config, ...tempConfig };
        await StorageUtil.ids.updateOne({ id }, { $set: { config: newConfig } }, { upsert: true });
        return true;
      }
    } catch (e) {
      LogUtil.error(e.message);
    }

    return false;
  }
}

export default ConfigUtil;
