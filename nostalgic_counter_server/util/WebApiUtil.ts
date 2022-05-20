import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import LogUtil from "./LogUtil.ts";
import SettingUtil from "./SettingUtil.ts";
import WebApiUtilCore from "./WebApiUtilCore.ts";

class WebApiUtil {
  // class variables
  // deno-lint-ignore no-explicit-any
  static app: Application<Record<string, any>>;

  // class methods
  static setup() {
    const app = new Application();

    // logger
    app.use(async (ctx, next) => {
      await next();
      const rt = ctx.response.headers.get("X-Response-Time");
      LogUtil.info(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
    });

    // timing
    app.use(async (ctx, next) => {
      const start = Date.now();
      await next();
      const ms = Date.now() - start;
      ctx.response.headers.set("X-Response-Time", `${ms}ms`);
    });

    const router = new Router();
    router.get("/api/version", WebApiUtilCore.get_version);

    router.get("/api/admin/new", WebApiUtilCore.get_admin_new);
    router.get("/api/admin/config", WebApiUtilCore.get_admin_config);
    router.get("/api/admin/reset", WebApiUtilCore.get_admin_reset);
    router.get("/api/counter", WebApiUtilCore.get_counter);

    app.use(oakCors({ origin: "*" }));
    // app.use(
    //   oakCors({
    //     origin: "http://localhost:3000",
    //     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    //     allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
    //     optionsSuccessStatus: 200,
    //     credentials: true,
    //   })
    // );
    app.use(router.routes());
    app.use(router.allowedMethods());

    WebApiUtil.app = app;
  }

  static async start() {
    LogUtil.info(
      "listen",
      `http://${SettingUtil.setting.host_name}:${SettingUtil.setting.port}`
    );

    await WebApiUtil.app.listen({
      hostname: SettingUtil.setting.host_name,
      port: SettingUtil.setting.port,
    });
  }
}

export default WebApiUtil;
