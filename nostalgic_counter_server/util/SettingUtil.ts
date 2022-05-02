import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { ensureDirSync } from "https://deno.land/std/fs/ensure_dir.ts";
import * as Hjson from "https://deno.land/x/hjson_deno/mod.ts";

import LogUtil from "./LogUtil.ts";

type SettingType = {
  host_name: string;
  port: number;
};

class SettingUtil {
  // class variables
  static DefaultSetting: SettingType = {
    host_name: "localhost",
    port: 20222,
  };

  static rootPath = "";
  static setting: SettingType;

  // class methods
  static setup() {
    let home =
      Deno.env.get("HOME") ||
      `${Deno.env.get("HOMEDRIVE")}${Deno.env.get("HOMEPATH")}`;
    if (home) {
      home = home.replaceAll("\\", "/");
    }

    SettingUtil.rootPath = `${home}/.nostalgic_counter_server`;
    LogUtil.debug("rootPath", SettingUtil.rootPath);

    // setting.hjsonがなければ作る
    const settingPath = `${SettingUtil.rootPath}/setting.hjson`;
    if (existsSync(settingPath) === false) {
      SettingUtil.create();
    }
  }

  static create() {
    ensureDirSync(SettingUtil.rootPath);

    const settingPath = `${SettingUtil.rootPath}/setting.hjson`;
    LogUtil.debug("settingPath", settingPath);

    const newSettingText = Hjson.stringify(SettingUtil.DefaultSetting);

    try {
      Deno.writeTextFileSync(settingPath, newSettingText);

      return true;
    } catch (e) {
      LogUtil.error(e.message);
    }

    return false;
  }

  static load() {
    const settingPath = `${SettingUtil.rootPath}/setting.hjson`;
    LogUtil.debug("settingPath", settingPath);

    try {
      const settingText = Deno.readTextFileSync(settingPath);
      const setting: SettingType = Hjson.parse(settingText);
      LogUtil.debug("setting", setting);

      SettingUtil.setting = setting;
    } catch (e) {
      LogUtil.error(e.message);
    }
  }
}

export default SettingUtil;
