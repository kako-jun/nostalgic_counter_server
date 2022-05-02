import LogUtil from "./util/LogUtil.ts";
import SettingUtil from "./util/SettingUtil.ts";
import ConfigUtil from "./util/ConfigUtil.ts";
import CounterUtil from "./util/CounterUtil.ts";
import IgnoreListUtil from "./util/IgnoreListUtil.ts";
import WebApiUtil from "./util/WebApiUtil.ts";

class App {
  static Version = "1.0.0.0";

  constructor() {}

  async start() {
    await LogUtil.setup();
    LogUtil.info("App start");
    LogUtil.info("version", App.Version);

    SettingUtil.setup();
    SettingUtil.load();
    ConfigUtil.setup();
    CounterUtil.setup();
    IgnoreListUtil.setup();
    await WebApiUtil.start();
  }
}

export default App;
