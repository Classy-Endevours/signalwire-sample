/* eslint-disable consistent-return */
import { enc, AES } from "crypto-js";

const developmentKey = "0123456789abcdef0123456789abcdef";

const encrypt = (value) => {
  const key = enc.Hex.parse(process.env.SECRET_KEY || developmentKey);
  const iv = enc.Hex.parse(process.env.SECRET_KEY || developmentKey);
  const encrypted = AES.encrypt(enc.Utf8.parse(value.toString()), key, {
    iv,
  });

  return encrypted.toString();
};

export default {
  encrypt,
};
