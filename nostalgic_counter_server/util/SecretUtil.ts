import LogUtil from "./LogUtil.ts";
import CommonUtil from "./CommonUtil.ts";
import SettingUtil from "./SettingUtil.ts";
import StorageUtil, { SecretType } from "./StorageUtil.ts";

class SecretUtil {
  // class variables
  static DefaultSecret: SecretType = {
    ciphered_password: "",
  };

  // class methods
  static async create(id: string, password: string) {
    const cipheredPassword = await CommonUtil.encrypt(password, SettingUtil.setting.master_password);

    const newSecret = {
      ...SecretUtil.DefaultSecret,
      ciphered_password: cipheredPassword,
    };

    try {
      await StorageUtil.ids.updateOne({ id }, { $set: { secret: newSecret } }, { upsert: true });
      return true;
    } catch (e) {
      LogUtil.error(e.message);
    }

    return false;
  }

  static async load(id: string) {
    try {
      const idDoc = await StorageUtil.ids.findOne({ id });
      if (idDoc) {
        const secret = idDoc.secret;
        if (secret) {
          const password = await CommonUtil.decrypt(secret.ciphered_password, SettingUtil.setting.master_password);
          return password;
        }
      }
    } catch (e) {
      LogUtil.error(e.message);
    }

    return null;
  }

  static async save(id: string, password: string) {
    const cipheredPassword = await CommonUtil.encrypt(password, SettingUtil.setting.master_password);

    const newSecret = {
      ...SecretUtil.DefaultSecret,
      ciphered_password: cipheredPassword,
    };

    try {
      await StorageUtil.ids.updateOne({ id }, { $set: { secret: newSecret } }, { upsert: true });
      return true;
    } catch (e) {
      LogUtil.error(e.message);
    }

    return false;
  }

  static async isPasswordCorrect(id: string, password: string) {
    const savedPassword = await SecretUtil.load(id);
    if (savedPassword) {
      if (savedPassword === password) {
        return true;
      }
    }

    return false;
  }
}

export default SecretUtil;
