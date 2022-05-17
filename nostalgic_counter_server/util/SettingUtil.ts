import { ensureDirSync } from "https://deno.land/std/fs/ensure_dir.ts";
import * as Hjson from "https://deno.land/x/hjson_deno/mod.ts";

import LogUtil from "./LogUtil.ts";
import CommonUtil from "./CommonUtil.ts";

type SettingType = {
  host_name: string;
  port: number;
  master_password: string;
};

class SettingUtil {
  // class variables
  static DefaultSetting: SettingType = {
    host_name: Deno.env.get("HOST") || "localhost",
    port: Number(Deno.env.get("PORT")) || 8080,
    master_password: "",
  };

  static rootPath = "";
  static setting: SettingType;

  // class methods
  static async setup() {
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
    if ((await CommonUtil.exists(settingPath)) === false) {
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

      SettingUtil.setting = { ...SettingUtil.DefaultSetting, ...setting };
    } catch (e) {
      LogUtil.error(e.message);
    }
  }
}

export default SettingUtil;
