import { JWT_SECRET } from "../src/common";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const tokenExpirationInSeconds = 36000;

export class JwtService {
  public static generateToken(permissionLevel: number) {
    try {
      const salt = crypto.randomBytes(16).toString("base64");
      // const refreshId = "123321" + JWT_SECRET;
      // const hash = crypto.createHmac("sha512", salt).update(refreshId).digest("base64");

      const expiresAt = new Date();
      expiresAt.setHours(
        expiresAt.getHours() + tokenExpirationInSeconds / 3600
      );
      const token = jwt.sign(
        {
          userId: "007",
          email: "autogenerated@jwt.com",
          permissionLevel: permissionLevel,
          provider: "email",
          name: "bond",
          refreshKey: salt,
        },
        JWT_SECRET
      );
      // const b = Buffer.from(hash);
      // const refreshToken = b.toString("base64");
      return token;
    } catch (err) {
      throw err;
    }
  }
}
