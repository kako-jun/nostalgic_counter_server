import { AES } from "https://deno.land/x/god_crypto/aes.ts";

import LogUtil from "./LogUtil.ts";

class CommonUtil {
  // class methods
  static encrypt = async (text: string) => {
    const aes = new AES("Hello World AES!", {
      mode: "cbc",
      iv: "random 16byte iv",
    });

    const cipher = await aes.encrypt(text);
    const encryptedText = cipher.hex();
    console.debug(encryptedText);

    return encryptedText;
  };

  static decrypt = async (cipheredText: string) => {
    const aes = new AES("Hello World AES!", {
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

    // const cipher = new TextEncoder().encode(cipheredText);
    const password = await aes.decrypt(Uint8Array.from(cipheredTextArray));
    console.log(password.toString());
    return password.toString();
  };
}

export default CommonUtil;
