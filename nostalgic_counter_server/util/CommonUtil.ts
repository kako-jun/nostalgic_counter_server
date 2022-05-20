import { AES } from "https://deno.land/x/god_crypto/aes.ts";

import LogUtil from "./LogUtil.ts";

class CommonUtil {
  // class methods
  static async exists(path: string) {
    try {
      await Deno.stat(path);
      return true;
    } catch (e) {
      // do nothing.
    }

    return false;
  }

  static async encrypt(text: string, master_password: string) {
    const aes = new AES(master_password, {
      mode: "cbc",
      iv: "random 16byte iv",
    });

    const cipher = await aes.encrypt(text);
    const encryptedText = cipher.hex();
    return encryptedText;
  }

  static async decrypt(cipheredText: string, master_password: string) {
    const aes = new AES(master_password, {
      mode: "cbc",
      iv: "random 16byte iv",
    });

    let cipheredTextArray: number[] = [];
    const devided = cipheredText.match(/.{2}/g);
    if (devided) {
      cipheredTextArray = devided.map((d) => {
        return parseInt(d, 16);
      });
    }

    const password = await aes.decrypt(Uint8Array.from(cipheredTextArray));
    return password.toString();
  }
}

export default CommonUtil;
