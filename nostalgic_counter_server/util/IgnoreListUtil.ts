import { ensureDirSync } from "https://deno.land/std/fs/ensure_dir.ts";
import * as Hjson from "https://deno.land/x/hjson_deno/mod.ts";

import LogUtil from "./LogUtil.ts";
import CommonUtil from "./CommonUtil.ts";

type IgnoreListType = {
  host_list: string[];
  ip_list: string[];
};

class IgnoreListUtil {
  // class variables
  static DefaultSetting: IgnoreListType = {
    host_list: [],
    ip_list: [],
  };

  static rootPath = "";

  // class methods
  static async setup() {
    let home =
      Deno.env.get("HOME") ||
      `${Deno.env.get("HOMEDRIVE")}${Deno.env.get("HOMEPATH")}`;
    if (home) {
      home = home.replaceAll("\\", "/");
    }

    IgnoreListUtil.rootPath = `${home}/.nostalgic_counter_server`;
    LogUtil.debug("rootPath", IgnoreListUtil.rootPath);

    // ignore_list.hjsonがなければ作る
    const ignoreListPath = `${IgnoreListUtil.rootPath}/ignore_list.hjson`;
    if ((await CommonUtil.exists(ignoreListPath)) === false) {
      IgnoreListUtil.create();
    }
  }

  static create() {
    ensureDirSync(IgnoreListUtil.rootPath);

    const ignoreListPath = `${IgnoreListUtil.rootPath}/ignore_list.hjson`;
    LogUtil.debug("ignoreListPath", ignoreListPath);

    const newIgnoreListText = Hjson.stringify(IgnoreListUtil.DefaultSetting);

    try {
      Deno.writeTextFileSync(ignoreListPath, newIgnoreListText);

      return true;
    } catch (e) {
      LogUtil.error(e.message);
    }

    return false;
  }

  static isIgnoreHost(host: string) {
    const ignoreListPath = `${IgnoreListUtil.rootPath}/ignore_list.hjson`;
    LogUtil.debug("ignoreListPath", ignoreListPath);

    let hostList: string[] = [];
    try {
      const ignoreListText = Deno.readTextFileSync(ignoreListPath);
      const ignoreList: IgnoreListType = Hjson.parse(ignoreListText);
      LogUtil.debug("ignoreList", ignoreList);

      hostList = ignoreList.host_list;
    } catch (e) {
      LogUtil.error(e.message);
    }

    const found = hostList.find((ignoreHost: string) => {
      return ignoreHost === host;
    });

    if (found) {
      return true;
    }

    return false;
  }
}

export default IgnoreListUtil;
