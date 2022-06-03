import { parse, stringify } from "https://deno.land/std/encoding/yaml.ts";

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
    host_name: Deno.env.get("HOST") || "0.0.0.0",
    port: Number(Deno.env.get("PORT")) || 8080,
    master_password: Deno.env.get("NOSTALGIC_COUNTER_MASTER_PASS") || "",
  };

  static setting: SettingType = SettingUtil.DefaultSetting;
  static settingPath = "";

  // class methods
  static setup() {
    let home = Deno.env.get("HOME") || `${Deno.env.get("HOMEDRIVE")}${Deno.env.get("HOMEPATH")}`;
    if (home) {
      home = home.replaceAll("\\", "/");
    }

    const rootPath = `${home}/.nostalgic_counter_server`;
    LogUtil.debug({ rootPath });

    SettingUtil.settingPath = `${rootPath}/setting.yml`;
    LogUtil.debug("settingPath", SettingUtil.settingPath);
  }

  static async load() {
    if (await CommonUtil.exists(SettingUtil.settingPath)) {
      try {
        const settingText = Deno.readTextFileSync(SettingUtil.settingPath);
        const setting = parse(settingText) as SettingType;

        SettingUtil.setting = { ...SettingUtil.DefaultSetting, ...setting };
      } catch (e) {
        LogUtil.error(e.message);
      }
    }

    // パスワードが見えてしまうため、コメントアウト
    // LogUtil.debug("setting", SettingUtil.setting);
  }
}

export default SettingUtil;
