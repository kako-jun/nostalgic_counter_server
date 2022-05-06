import { ensureDirSync } from "https://deno.land/std/fs/ensure_dir.ts";
import * as Hjson from "https://deno.land/x/hjson_deno/mod.ts";

import LogUtil from "./LogUtil.ts";
import CommonUtil from "./CommonUtil.ts";
import SettingUtil from "./SettingUtil.ts";

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

    const cipheredPassword = await CommonUtil.encrypt(
      password,
      SettingUtil.setting.master_password
    );

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

  static async load(id: string) {
    const secretPath = `${SecretUtil.rootPath}/ids/${id}/secret.hjson`;
    LogUtil.debug("secretPath", secretPath);

    try {
      const secretText = Deno.readTextFileSync(secretPath);
      const secret: SecretType = Hjson.parse(secretText);
      LogUtil.debug("secret", secret);

      const password = await CommonUtil.decrypt(
        secret.ciphered_password,
        SettingUtil.setting.master_password
      );
      return password;
    } catch (e) {
      LogUtil.error(e.message);
    }

    return null;
  }

  static async save(id: string, password: string) {
    const secretPath = `${SecretUtil.rootPath}/ids/${id}/secret.hjson`;
    LogUtil.debug("secretPath", secretPath);

    const cipheredPassword = await CommonUtil.encrypt(
      password,
      SettingUtil.setting.master_password
    );

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

  static async isPasswordCorrect(id: string, password: string) {
    const savedPassword = await SecretUtil.load(id);
    if (savedPassword === password) {
      return true;
    }

    return false;
  }
}

export default SecretUtil;
