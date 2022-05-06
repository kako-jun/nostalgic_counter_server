import { ensureDirSync } from "https://deno.land/std/fs/ensure_dir.ts";
import { datetime, diffInMin } from "https://deno.land/x/ptera/mod.ts";
import * as Hjson from "https://deno.land/x/hjson_deno/mod.ts";

import LogUtil from "./LogUtil.ts";

type IpsType = {
  [s: string]: string;
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

  static save(id: string, ips: IpsType) {
    const ipsPath = `${IpsUtil.rootPath}/ids/${id}/ips.hjson`;
    LogUtil.debug("ipsPath", ipsPath);

    const ipsText = Hjson.stringify(ips);

    try {
      Deno.writeTextFileSync(ipsPath, ipsText);

      return true;
    } catch (e) {
      LogUtil.error(e.message);
    }

    return false;
  }

  static isIntervalOk(id: string, host: string, intervalMinutes: number) {
    const now = datetime();

    const ips = IpsUtil.load(id);
    if (ips) {
      if (host in ips) {
        const preDt = datetime(new Date(ips[host]));
        const diff = diffInMin(now, preDt);
        if (diff < intervalMinutes) {
          return false;
        }
      }
    }

    // const newIps = { ...ips, [host]: now.toZonedTime("UTC").toISO() };
    const newIps = { ...ips, [host]: now.toISO() };
    IpsUtil.save(id, newIps);
    return true;
  }
}

export default IpsUtil;
