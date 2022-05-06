import { AES } from "https://deno.land/x/god_crypto/aes.ts";

import LogUtil from "./LogUtil.ts";

class CommonUtil {
  // class methods
  static encrypt = async (password: string) => {
    const cipher = crypto.subtle.createCipher("aes128", password);
    cipher.update(password, "utf8", "hex");
    const cipheredText = cipher.final("hex");

    const passwordUint8Array = new TextEncoder().encode(password);
    const saltUint8Array = new TextEncoder().encode("salt");
    const rawUint8Array = new TextEncoder().encode("raw");

    const importedPassword = await crypto.subtle.importKey(
      "raw",
      passwordUint8Array,
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: saltUint8Array,
        iterations: 100000,
        hash: "SHA-256",
      },
      importedPassword,
      {
        name: "AES-GCM",
        length: 128,
      },
      false,
      ["encrypt", "decrypt"]
    );

    const encrypted = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: crypto.getRandomValues(new Uint8Array(16)),
        tagLength: 128,
      },
      key,
      rawUint8Array
    );

    const encryptedUint8Array = new Uint8Array(encrypted);
    const encryptedText = new TextDecoder().decode(encryptedUint8Array);

    console.debug(encryptedText);
    return encryptedText;
  };

  static decrypt = async (cipheredPassword: string) => {
    // const data = new TextEncoder().encode("Deno 1.11 has been released!");
    // const digest = await crypto.subtle.digest("sha-256", data.buffer);
    // console.log("Digest:", encode(new Uint8Array(digest)));

    return "";
  };

  // static encryptThenDecrypt = async (
  //   salt = "the salt is this random string"
  // ) => {
  //   const raw = "this is a secret";
  //   const password = "mysecretpassword";

  //   const importedPassword = await window.crypto.subtle.importKey(
  //     "raw",
  //     stringToUint8Array(password),
  //     { name: "PBKDF2" },
  //     false,
  //     ["deriveKey"]
  //   );

  //   const key = await window.crypto.subtle.deriveKey(
  //     {
  //       name: "PBKDF2",
  //       salt: stringToUint8Array(salt),
  //       iterations: 100000,
  //       hash: "SHA-256",
  //     },
  //     importedPassword,
  //     {
  //       name: "AES-GCM",
  //       length: 128,
  //     },
  //     false,
  //     ["encrypt", "decrypt"]
  //   );

  //   const iv = window.crypto.getRandomValues(new Uint8Array(12));
  //   const encrypted = await window.crypto.subtle.encrypt(
  //     {
  //       name: "AES-GCM",
  //       iv: iv,
  //     },
  //     key,
  //     stringToUint8Array(raw)
  //   );

  //   const encrypted_data = new Uint8Array(encrypted);

  //   const decrypted = await window.crypto.subtle.decrypt(
  //     {
  //       name: "AES-GCM",
  //       iv: iv,
  //     },
  //     key,
  //     encrypted_data
  //   );
  //   return `Decrypted data: ${uint8ArrayToString(decrypted)}`;
  // };
}

export default CommonUtil;
