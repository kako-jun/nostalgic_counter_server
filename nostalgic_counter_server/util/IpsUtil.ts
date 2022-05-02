import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { ensureDirSync } from "https://deno.land/std/fs/ensure_dir.ts";
import * as Hjson from "https://deno.land/x/hjson_deno/mod.ts";

import LogUtil from "./LogUtil.ts";

type IpsType = {
  [s: string]: number;
};

class IpsUtil {
  // class variables
  static DefaultIps: IpsType = {};

  static rootPath = "";

  // class methods
  static setup() {
    let home =
      Deno.env.get("HOME") ||
      `${Deno.env.get("HOMEDRIVE")}${Deno.env.get("HOMEPATH")}`;
    if (home) {
      home = home.replaceAll("\\", "/");
    }

    IpsUtil.rootPath = `${home}/.nostalgic_counter_server`;
    LogUtil.debug("rootPath", IpsUtil.rootPath);
  }

  static create(id: string) {
    const idDirPath = `${IpsUtil.rootPath}/ids/${id}`;
    ensureDirSync(idDirPath);

    const ipsPath = `${IpsUtil.rootPath}/ids/${id}/ips.hjson`;
    LogUtil.debug("ipsPath", ipsPath);

    const newIpsText = Hjson.stringify(IpsUtil.DefaultIps);

    try {
      Deno.writeTextFileSync(ipsPath, newIpsText);

      return true;
    } catch (e) {
      LogUtil.error(e.message);
    }

    return false;
  }

  static load(id: string) {
    const ipsPath = `${IpsUtil.rootPath}/ids/${id}/ips.hjson`;
    LogUtil.debug("ipsPath", ipsPath);

    try {
      const ipsText = Deno.readTextFileSync(ipsPath);
      const ips: IpsType = Hjson.parse(ipsText);
      LogUtil.debug("ips", ips);

      return ips;
    } catch (e) {
      LogUtil.error(e.message);
    }

    return null;
  }

  static save(id: string, intervalMinutes: number, offsetCount: number) {
    const ips = IpsUtil.load(id);
    if (ips) {
      const ipsPath = `${IpsUtil.rootPath}/ids/${id}/ips.hjson`;
      LogUtil.debug("ipsPath", ipsPath);

      // const tempConfig: any = {};

      // if (intervalMinutes >= 0) {
      //   tempConfig.interval_minutes = intervalMinutes;
      // }

      // if (offsetCount >= 0) {
      //   tempConfig.offset_count = offsetCount;
      // }

      const newIps: IpsType = {};

      // const newConfig = { ...config, ...tempConfig };
      const newIpsText = Hjson.stringify(newIps);

      try {
        Deno.writeTextFileSync(ipsPath, newIpsText);

        return true;
      } catch (e) {
        LogUtil.error(e.message);
      }
    }

    return false;
  }
}

export default IpsUtil;
