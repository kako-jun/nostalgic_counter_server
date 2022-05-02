import {
  RouterContext,
  RouteParams,
  helpers,
} from "https://deno.land/x/oak/mod.ts";

import App from "../app.ts";
import LogUtil from "./LogUtil.ts";
import ConfigUtil from "./ConfigUtil.ts";
import CounterUtil from "./CounterUtil.ts";
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
  static get_admin_new(context: any) {
    LogUtil.debug("get_admin_new");
    let res: Res = { errCode: -1, data: null };
    const query = helpers.getQuery(context, { mergeParams: true });

    if (IgnoreListUtil.isIgnoreHost(context.request.headers.get("host"))) {
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

      if (ConfigUtil.create(id, password)) {
        const config = ConfigUtil.load(id);

        if (CounterUtil.create(id)) {
          res = { errCode: 0, data: config };
        }
      } else {
        res = { errCode: -1, data: `ID: ${id} already exists.` };
      }
    }

    LogUtil.debug("res", res);
    context.response.body = res;
  }

  // GET /admin/config
  // deno-lint-ignore no-explicit-any
  static get_admin_config(context: any) {
    LogUtil.debug("get_admin_config");
    let res: Res = { errCode: -1, data: null };
    const query = helpers.getQuery(context, { mergeParams: true });

    if (IgnoreListUtil.isIgnoreHost(context.request.headers.get("host"))) {
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

      // if (!this.exist(path.resolve(this.rootPath, "json", id))) {
      //   res.send({ error: "ID '" + id + "' not found." });
      //   return;
      // }

      // if (!this.isPasswordCorrect(id, password)) {
      //   res.send({ error: "Wrong ID or password." });
      //   return;
      // }

      if (ConfigUtil.save(id, intervalMinutes, offsetCount)) {
        const newConfig = ConfigUtil.load(id);
        if (newConfig) {
          res = { errCode: 0, data: newConfig };
        }
      }
    }

    LogUtil.debug("res", res);
    context.response.body = res;
  }

  // GET /admin/reset
  // deno-lint-ignore no-explicit-any
  static get_admin_reset(context: any) {
    LogUtil.debug("get_admin_reset");
    let res: Res = { errCode: -1, data: null };
    const query = helpers.getQuery(context, { mergeParams: true });

    if (IgnoreListUtil.isIgnoreHost(context.host)) {
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

      if (ConfigUtil.create(id, password)) {
        const config = ConfigUtil.load(id);
        res = { errCode: 0, data: config };
      } else {
        res = { errCode: -1, data: `ID: ${id} already exists.` };
      }
    }

    LogUtil.debug("res", res);
    context.response.body = res;
  }

  // GET /counter
  // deno-lint-ignore no-explicit-any
  static get_counter(context: any) {
    LogUtil.debug("get_counter");
    let res: Res = { errCode: -1, data: null };
    const query = helpers.getQuery(context, { mergeParams: true });

    if (IgnoreListUtil.isIgnoreHost(context.host)) {
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

      // if (!this.exist(path.resolve(this.rootPath, "json", id))) {
      //   res.send({ error: "ID '" + id + "' not found." });
      //   return;
      // }

      if (CounterUtil.increment(id)) {
        const counter = CounterUtil.load(id);
        res = { errCode: 0, data: counter };
      }
    }

    LogUtil.debug("res", res);
    context.response.body = res;
  }
}

export default WebApiUtilCore;
