import { ensureDirSync } from "https://deno.land/std/fs/ensure_dir.ts";
import * as Hjson from "https://deno.land/x/hjson_deno/mod.ts";

import LogUtil from "./LogUtil.ts";

type ConfigType = {
  interval_minutes: number;
  offset_count: number;
};

class ConfigUtil {
  // class variables
  static DefaultConfig: ConfigType = {
    interval_minutes: 0,
    offset_count: 0,
  };

  static rootPath = "";

  // class methods
  static setup() {
    let home =
      Deno.env.get("HOME") ||
      `${Deno.env.get("HOMEDRIVE")}${Deno.env.get("HOMEPATH")}`;
    if (home) {
      home = home.replaceAll("\\", "/");
    }

    ConfigUtil.rootPath = `${home}/.nostalgic_counter_server`;
    LogUtil.debug("rootPath", ConfigUtil.rootPath);
  }

  static create(id: string, password: string) {
    const idDirPath = `${ConfigUtil.rootPath}/ids/${id}`;
    ensureDirSync(idDirPath);

    const configPath = `${ConfigUtil.rootPath}/ids/${id}/config.hjson`;
    LogUtil.debug("configPath", configPath);

    const newConfigText = Hjson.stringify(ConfigUtil.DefaultConfig);

    try {
      Deno.writeTextFileSync(configPath, newConfigText);

      return true;
    } catch (e) {
      LogUtil.error(e.message);
    }

    return false;
  }

  static load(id: string) {
    const configPath = `${ConfigUtil.rootPath}/ids/${id}/config.hjson`;
    LogUtil.debug("configPath", configPath);

    try {
      const configText = Deno.readTextFileSync(configPath);
      const config: ConfigType = Hjson.parse(configText);
      LogUtil.debug("config", config);

      return config;
    } catch (e) {
      LogUtil.error(e.message);
    }

    return null;
  }

  static save(id: string, intervalMinutes: number, offsetCount: number) {
    const config = ConfigUtil.load(id);
    if (config) {
      const configPath = `${ConfigUtil.rootPath}/ids/${id}/config.hjson`;
      LogUtil.debug("configPath", configPath);

      const tempConfig: any = {};

      if (intervalMinutes >= 0) {
        tempConfig.interval_minutes = intervalMinutes;
      }

      if (offsetCount >= 0) {
        tempConfig.offset_count = offsetCount;
      }

      const newConfig = { ...config, ...tempConfig };
      const newConfigText = Hjson.stringify(newConfig);

      try {
        Deno.writeTextFileSync(configPath, newConfigText);

        return true;
      } catch (e) {
        LogUtil.error(e.message);
      }
    }

    return false;
  }
}

export default ConfigUtil;
