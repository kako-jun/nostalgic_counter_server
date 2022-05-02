import * as log from "https://deno.land/std/log/mod.ts";
import { FileHandler } from "https://deno.land/std/log/handlers.ts";
import { ensureDirSync } from "https://deno.land/std/fs/ensure_dir.ts";
import { format } from "https://deno.land/std/datetime/mod.ts";
import { Path, WINDOWS_SEPS } from "https://deno.land/x/path/mod.ts";

class LogUtil {
  // class variables
  static logger: log.Logger = log.getLogger();

  // class methods
  static async setup() {
    let home =
      Deno.env.get("HOME") ||
      `${Deno.env.get("HOMEDRIVE")}${Deno.env.get("HOMEPATH")}`;
    ensureDirSync(`${home}/.nostalgic_counter_server/log`);

    let logPath = new Path(
      `${home}/.nostalgic_counter_server/log/nostalgic_counter_server.log`
    );
    if (home.includes("\\")) {
      logPath = new Path(
        `${home}/.nostalgic_counter_server/log/nostalgic_counter_server.log`,
        WINDOWS_SEPS
      );
    }

    const formatter = (record: log.LogRecord) => {
      let line = `${format(record.datetime, "yyyy-MM-dd HH:mm:ss.SSS")} [${
        record.levelName
      }] ${record.msg}`;
      if (record.args.length > 0) {
        line += ":";

        record.args.forEach((arg) => {
          switch (typeof arg) {
            case "string":
              line += ` ${arg}`;
              break;
            // case "object":
            default:
              line += ` ${JSON.stringify(arg, null, 2)}`;
              break;
          }
        });
      }

      return line;
    };

    await log.setup({
      handlers: {
        console: new log.handlers.ConsoleHandler("DEBUG", {
          formatter,
        }),

        file: new log.handlers.RotatingFileHandler("DEBUG", {
          filename: `${logPath.toString()}`,
          formatter,
          maxBytes: 1 * 1024 * 1024, // 1MB
          maxBackupCount: 5,
        }),
      },

      loggers: {
        default: {
          level: "DEBUG",
          handlers: ["console", "file"],
        },
      },
    });

    const logger = log.getLogger();
    LogUtil.logger = logger;
  }

  // deno-lint-ignore no-explicit-any
  static debug(msg: any, ...args: any[]) {
    LogUtil.logger.debug(msg, ...args);

    const fileHandler = <FileHandler>LogUtil.logger.handlers[1];
    fileHandler.flush();
  }

  // deno-lint-ignore no-explicit-any
  static info(msg: any, ...args: any[]) {
    LogUtil.logger.info(msg, ...args);

    const fileHandler = <FileHandler>LogUtil.logger.handlers[1];
    fileHandler.flush();
  }

  // deno-lint-ignore no-explicit-any
  static warning(msg: any, ...args: any[]) {
    LogUtil.logger.warning(msg, ...args);

    const fileHandler = <FileHandler>LogUtil.logger.handlers[1];
    fileHandler.flush();
  }

  // deno-lint-ignore no-explicit-any
  static error(msg: any, ...args: any[]) {
    LogUtil.logger.error(msg, ...args);

    const fileHandler = <FileHandler>LogUtil.logger.handlers[1];
    fileHandler.flush();
  }

  // deno-lint-ignore no-explicit-any
  static critical(msg: any, ...args: any[]) {
    LogUtil.logger.critical(msg, ...args);
  }
}

export default LogUtil;
