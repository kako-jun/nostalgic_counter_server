import {
  RouterContext,
  RouteParams,
  helpers,
} from "https://deno.land/x/oak/mod.ts";

import App from "../app.ts";
import LogUtil from "./LogUtil.ts";
import CommonUtil from "./CommonUtil.ts";
import ConfigUtil from "./ConfigUtil.ts";
import SecretUtil from "./SecretUtil.ts";
import CounterUtil from "./CounterUtil.ts";
import IpsUtil from "./IpsUtil.ts";
import IgnoreListUtil from "./IgnoreListUtil.ts";

type Res = {
  errCode: number;
  data: Map<string, any> | any | null;
};

class WebApiUtilCore {
  // GET /version
  // deno-lint-ignore no-explicit-any
  static get_version(context: any) {
    LogUtil.debug("get_version");
    const res: Res = { errCode: 0, data: App.Version };
    LogUtil.debug("res", res);
    context.response.body = res;
  }

  // GET /admin/new
  // deno-lint-ignore no-explicit-any
  static async get_admin_new(context: any) {
    LogUtil.debug("get_admin_new");
    let res: Res = { errCode: -1, data: null };
    const query = helpers.getQuery(context, { mergeParams: true });

    const host = context.request.headers.get("X-Forwarded-For");
    if (IgnoreListUtil.isIgnoreHost(host)) {
      // do nothing.
    } else {
      let id = "default";
      if ("id" in query) {
        id = query.id;
      }

      let password = "";
      if ("password" in query) {
        password = query.password;
      }

      if (await CommonUtil.idDirExists(SecretUtil.rootPath, id)) {
        res = { errCode: -1, data: `ID: ${id} already exists.` };
      } else {
        if (await SecretUtil.create(id, password)) {
          if (ConfigUtil.create(id)) {
            if (CounterUtil.create(id)) {
              if (IpsUtil.create(id)) {
                const config = ConfigUtil.load(id);
                if (config) {
                  res = { errCode: 0, data: config };
                }
              }
            }
          }
        }
      }
    }

    LogUtil.debug("res", res);
    context.response.body = res;
  }

  // GET /admin/config
  // deno-lint-ignore no-explicit-any
  static async get_admin_config(context: any) {
    LogUtil.debug("get_admin_config");
    let res: Res = { errCode: -1, data: null };
    const query = helpers.getQuery(context, { mergeParams: true });

    const host = context.request.headers.get("X-Forwarded-For");
    if (IgnoreListUtil.isIgnoreHost(host)) {
      // do nothing.
    } else {
      let id = "default";
      if ("id" in query) {
        id = query.id;
      }

      let password = "";
      if ("password" in query) {
        password = query.password;
      }

      let intervalMinutes = -1;
      if ("interval_minutes" in query) {
        intervalMinutes = Number(query.interval_minutes);
      }

      let offsetCount = -1;
      if ("offset_count" in query) {
        offsetCount = Number(query.offset_count);
      }

      if ((await CommonUtil.idDirExists(SecretUtil.rootPath, id)) === false) {
        res = { errCode: -1, data: `ID: ${id} not found.` };
      } else {
        if ((await SecretUtil.isPasswordCorrect(id, password)) === false) {
          res = { errCode: -1, data: "Wrong ID or password." };
        } else {
          if (ConfigUtil.save(id, intervalMinutes, offsetCount)) {
            const newConfig = ConfigUtil.load(id);
            if (newConfig) {
              res = { errCode: 0, data: newConfig };
            }
          }
        }
      }
    }

    LogUtil.debug("res", res);
    context.response.body = res;
  }

  // GET /admin/reset
  // deno-lint-ignore no-explicit-any
  static async get_admin_reset(context: any) {
    LogUtil.debug("get_admin_reset");
    let res: Res = { errCode: -1, data: null };
    const query = helpers.getQuery(context, { mergeParams: true });

    const host = context.request.headers.get("X-Forwarded-For");
    if (IgnoreListUtil.isIgnoreHost(host)) {
      // do nothing.
    } else {
      let id = "default";
      if ("id" in query) {
        id = query.id;
      }

      let password = "";
      if ("password" in query) {
        password = query.password;
      }

      if ((await CommonUtil.idDirExists(SecretUtil.rootPath, id)) === false) {
        res = { errCode: -1, data: `ID: ${id} not found.` };
      } else {
        if ((await SecretUtil.isPasswordCorrect(id, password)) === false) {
          res = { errCode: -1, data: "Wrong ID or password." };
        } else {
          if (CounterUtil.create(id)) {
            if (IpsUtil.create(id)) {
              const config = ConfigUtil.load(id);
              if (config) {
                res = { errCode: 0, data: config };
              }
            }
          }
        }
      }
    }

    LogUtil.debug("res", res);
    context.response.body = res;
  }

  // GET /counter
  // deno-lint-ignore no-explicit-any
  static async get_counter(context: any) {
    LogUtil.debug("get_counter");
    let res: Res = { errCode: -1, data: null };
    const query = helpers.getQuery(context, { mergeParams: true });

    const host = context.request.headers.get("X-Forwarded-For");
    if (IgnoreListUtil.isIgnoreHost(host)) {
      // do nothing.
    } else {
      let id = "default";
      if ("id" in query) {
        id = query.id;
      }

      let ex = false;
      if ("ex" in query) {
        ex = true;
      }

      if ((await CommonUtil.idDirExists(SecretUtil.rootPath, id)) === false) {
        res = { errCode: -1, data: `ID: ${id} not found.` };
      } else {
        const config = ConfigUtil.load(id);
        if (config) {
          if (IpsUtil.isIntervalOk(id, host, config.interval_minutes)) {
            if (CounterUtil.increment(id)) {
              // do nothing.
            }
          }

          const counter = CounterUtil.load(id);
          if (counter) {
            counter.total += config.offset_count;

            if (ex) {
              res = { errCode: 0, data: counter };
            } else {
              res = { errCode: 0, data: { total: counter.total } };
            }
          }
        }
      }
    }

    LogUtil.debug("res", res);
    context.response.body = res;
  }
}

export default WebApiUtilCore;
