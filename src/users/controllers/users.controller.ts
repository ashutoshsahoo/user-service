import { Request, Response } from "express";
import { UsersService } from "../services/users.services";
import { removeSecuredFields, generateSecurePassword } from "../utils/users.utils";
import { CommonPermissionMiddleware } from "../../common/middlewares/common.permission.middleware";

export class UsersController {
  public async listUsers(req: Request, res: Response) {
    const usersService = UsersService.getInstance();
    const users = await usersService.list(100, 0);
    const updatedUsers = users.map(removeSecuredFields);
    res.status(200).send(updatedUsers);
  }
  public async getUserById(req: Request, res: Response) {
    const usersService = UsersService.getInstance();
    const user = await usersService.readById(req.params.userId);
    res.status(200).send(removeSecuredFields(user));
  }
  public async createUser(req: Request, res: Response) {
    const usersService = UsersService.getInstance();
    const password = Buffer.from(req.body.password);
    req.body.password = await generateSecurePassword(password);
    req.body.permissionLevel = CommonPermissionMiddleware.BASIC_PERMISSION;
    const userId = await usersService.create(req.body);
    res.status(201).send({ id: userId });
  }
  public async patch(req: Request, res: Response) {
    const usersService = UsersService.getInstance();
    await usersService.patchById(req.body);
    res.status(204).send("");
  }
  public async put(req: Request, res: Response) {
    const usersService = UsersService.getInstance();
    await usersService.updateById(req.body);
    res.status(204).send("");
  }
  public async removeUser(req: Request, res: Response) {
    const usersService = UsersService.getInstance();
    await usersService.deleteById(req.params.userId);
    res.status(204).send("");
  }
}
