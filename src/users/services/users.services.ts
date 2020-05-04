import { CRUD } from "../../common";
import { UsersDao } from "../";

export class UsersService implements CRUD {
  private static instance: UsersService;
  public static getInstance(): UsersService {
    if (!UsersService.instance) {
      UsersService.instance = new UsersService();
    }
    return UsersService.instance;
  }
  public create(resource: any) {
    return UsersDao.getInstance().addUser(resource);
  }
  public deleteById(resourceId: any) {
    return UsersDao.getInstance().removeUserById(resourceId);
  }
  public list(limit: number, page: number) {
    return UsersDao.getInstance().listUsers(limit, page);
  }
  public patchById(resource: any) {
    return UsersDao.getInstance().patchUser(resource);
  }
  public readById(resourceId: any) {
    return UsersDao.getInstance().getUserById(resourceId);
  }
  public updateById(resource: any) {
    return UsersDao.getInstance().patchUser(resource);
  }
  public async getByEmail(email: string) {
    return UsersDao.getInstance().getUserByEmail(email);
  }
}
