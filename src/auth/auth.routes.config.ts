import { CommonRoutes } from "../common/common.routes.config";
import { AuthController } from "./controllers/auth.controller";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { JwtMiddleware } from "./middlewares/jwt.middleware";
import { Application } from "express";

export class AuthRoutes extends CommonRoutes {
  public constructor(app: Application) {
    super(app, "AuthenticationRoute");
  }
  protected configureRoutes() {
    const usersController = new AuthController();
    const authMiddleware = AuthMiddleware.getInstance();
    const jwtMiddleware = JwtMiddleware.getInstance();
    this.app.post("/auth", [
      authMiddleware.validateBodyRequest,
      authMiddleware.verifyUserPassword,
      usersController.createJWT,
    ]);
    this.app.post("/auth/refresh-token", [
      jwtMiddleware.validJWTNeeded,
      jwtMiddleware.verifyRefreshBodyField,
      jwtMiddleware.validRefreshNeeded,
      usersController.createJWT,
    ]);
  }
}
