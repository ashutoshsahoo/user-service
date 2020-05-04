import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JWT_SECRET } from "../../common/util/secrets";

export class JwtMiddleware {
  private static instance: JwtMiddleware;

  public static getInstance() {
    if (!JwtMiddleware.instance) {
      JwtMiddleware.instance = new JwtMiddleware();
    }
    return JwtMiddleware.instance;
  }

  public verifyRefreshBodyField(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (req.body && req.body.refreshToken) {
      return next();
    } else {
      return res.status(400).send({ error: "need body field: refreshToken" });
    }
  }

  public validRefreshNeeded(req: any, res: Response, next: NextFunction) {
    const b = Buffer.from(req.body.refreshToken, "base64");
    const refreshToken = b.toString();
    const hash = crypto
      .createHmac("sha512", req.jwt.refreshKey)
      .update(req.jwt.userId + JWT_SECRET)
      .digest("base64");
    if (hash === refreshToken) {
      delete req.jwt.iat;
      delete req.jwt.exp;
      req.body = req.jwt;
      return next();
    } else {
      return res.status(400).send({ error: "Invalid refresh token" });
    }
  }

  public validJWTNeeded(req: any, res: Response, next: NextFunction) {
    if (req.headers["authorization"]) {
      try {
        const authorization = req.headers["authorization"].split(" ");
        if (authorization[0] !== "Bearer") {
          return res.status(401).send();
        } else {
          req.jwt = jwt.verify(authorization[1], JWT_SECRET);
          next();
        }
      } catch (err) {
        return res.status(403).send();
      }
    } else {
      return res.status(401).send();
    }
  }
}
