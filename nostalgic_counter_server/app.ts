import LogUtil from "./util/LogUtil.ts";
import SettingUtil from "./util/SettingUtil.ts";
import StorageUtil from "./util/StorageUtil.ts";
import IgnoresUtil from "./util/IgnoresUtil.ts";
import WebApiUtil from "./util/WebApiUtil.ts";

class App {
  static Version = "1.0.0.0";

  constructor() {}

  async start() {
    await LogUtil.setup();
    LogUtil.info("App start");
    LogUtil.info("version", App.Version);

    SettingUtil.setup();
    await SettingUtil.load();

    await StorageUtil.setup();

    await IgnoresUtil.setup();

    WebApiUtil.setup();
    await WebApiUtil.start();
  }
}

export default App;
