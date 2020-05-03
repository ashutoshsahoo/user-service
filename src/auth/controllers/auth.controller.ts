import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JWT_SECRET } from "../../common";

const tokenExpirationInSeconds = 3600;

export class AuthController {
  public async createJWT(req: Request, res: Response) {
    try {
      const refreshId = req.body.userId + JWT_SECRET;
      const salt = crypto.randomBytes(16).toString("base64");
      const hash = crypto
        .createHmac("sha512", salt)
        .update(refreshId)
        .digest("base64");
      req.body.refreshKey = salt;
      const token = jwt.sign(req.body, JWT_SECRET, {
        expiresIn: tokenExpirationInSeconds,
      });
      const b = Buffer.from(hash);
      const refreshToken = b.toString("base64");
      return res
        .status(201)
        .send({ accessToken: token, refreshToken: refreshToken });
    } catch (err) {
      return res.status(500).send(err);
    }
  }
}
