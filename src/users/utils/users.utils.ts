import SecurePass from "argon2-pass";
import { Document } from "mongoose";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MaskData = require("maskdata");

export const generateSecurePassword = async (password: Buffer) => {
  const sp = new SecurePass();
  return (await sp.hashPassword(password)).toString("utf-8");
};

const emailMask2Options = {
  maskWith: "*",
  unmaskedStartCharactersBeforeAt: 3,
  unmaskedEndCharactersAfterAt: 257,
  maskAtTheRate: false,
};

const maskedEmail = (email: string) =>
  MaskData.maskEmail2(email, emailMask2Options);

export const removeSecuredFields = (user: Document): Document => {
  user = user.toJSON() as Document;
  delete user._id;
  delete user.__v;
  delete (user as any).password;
  const email = maskedEmail((user as any).email);
  (user as any).email = email;
  return user;
};
