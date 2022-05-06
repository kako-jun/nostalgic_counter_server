import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { ensureDirSync } from "https://deno.land/std/fs/ensure_dir.ts";
import * as Hjson from "https://deno.land/x/hjson_deno/mod.ts";

import LogUtil from "./LogUtil.ts";
import CommonUtil from "./CommonUtil.ts";

type SecretType = {
  ciphered_password: string;
};

class SecretUtil {
  // class variables
  static DefaultSecret: SecretType = {
    ciphered_password: "",
  };

  static rootPath = "";

  // class methods
  static setup() {
    let home =
      Deno.env.get("HOME") ||
      `${Deno.env.get("HOMEDRIVE")}${Deno.env.get("HOMEPATH")}`;
    if (home) {
      home = home.replaceAll("\\", "/");
    }

    SecretUtil.rootPath = `${home}/.nostalgic_counter_server`;
    LogUtil.debug("rootPath", SecretUtil.rootPath);
  }

  static async create(id: string, password: string) {
    const idDirPath = `${SecretUtil.rootPath}/ids/${id}`;
    ensureDirSync(idDirPath);

    const secretPath = `${SecretUtil.rootPath}/ids/${id}/secret.hjson`;
    LogUtil.debug("secretPath", secretPath);

    const cipheredPassword = await CommonUtil.encrypt(password);
    const pass = await CommonUtil.decrypt(cipheredPassword);

    const newSecret = {
      ...SecretUtil.DefaultSecret,
      ciphered_password: cipheredPassword,
    };
    const newSecretText = Hjson.stringify(newSecret);

    try {
      Deno.writeTextFileSync(secretPath, newSecretText);

      return true;
    } catch (e) {
      LogUtil.error(e.message);
    }

    return false;
  }

  static load(id: string) {
    const secretPath = `${SecretUtil.rootPath}/ids/${id}/secret.hjson`;
    LogUtil.debug("secretPath", secretPath);

    try {
      const secretText = Deno.readTextFileSync(secretPath);
      const secret: SecretType = Hjson.parse(secretText);
      LogUtil.debug("secret", secret);

      return secret;
    } catch (e) {
      LogUtil.error(e.message);
    }

    return null;
  }

  static save(id: string, password: string) {
    const secret = SecretUtil.load(id);
    if (secret) {
      const secretPath = `${SecretUtil.rootPath}/ids/${id}/secret.hjson`;
      LogUtil.debug("secretPath", secretPath);

      // const tempConfig: any = {};

      // if (intervalMinutes >= 0) {
      //   tempConfig.interval_minutes = intervalMinutes;
      // }

      // if (offsetCount >= 0) {
      //   tempConfig.offset_count = offsetCount;
      // }

      const newSecret: SecretType = { ciphered_password: "" };
      const newSecretText = Hjson.stringify(newSecret);

      try {
        Deno.writeTextFileSync(secretPath, newSecretText);

        return true;
      } catch (e) {
        LogUtil.error(e.message);
      }
    }

    return false;
  }
}

export default SecretUtil;
