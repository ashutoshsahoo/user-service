import shortUUID from "short-uuid";
import { generateSecurePassword } from "../";
import { MongooseService } from "../../common";

export class UsersDao {
  private mongooseService: MongooseService = MongooseService.getInstance();
  private static instance: UsersDao;
  private Schema = this.mongooseService.getMongoose().Schema;
  private userSchema = new this.Schema({
    _id: String,
    name: String,
    email: String,
    description: String,
    password: String,
    permissionLevel: Number,
  });
  private User = this.mongooseService
    .getMongoose()
    .model("Users", this.userSchema);

  public constructor() {
   // this.addAdminUser();
  }

  public async addAdminUser() {
    const adminUser = await this.User.findOne({ email: "admin@email.com" });
    if (adminUser == null) {
      console.log("Creating user - admin");
      const admin = {
        name: "admin",
        email: "admin@email.com",
        description: "Application admin user",
        password: await generateSecurePassword(Buffer.from("admin")),
        permissionLevel: 8192,
      };
      this.addUser(admin);
    }
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new UsersDao();
    }
    return this.instance;
  }

  public async addUser(userFields: any) {
    userFields._id = shortUUID.generate();
    const user = new this.User(userFields);
    await user.save();
    return userFields._id;
  }
  public async getUserByEmail(email: string) {
    return this.User.findOne({ email: email });
  }
  public async removeUserById(userId: string) {
    await this.User.deleteOne({ _id: userId });
  }
  public async getUserById(userId: string) {
    return this.User.findOne({ _id: userId });
  }
  public async listUsers(limit: number = 25, page: number = 0) {
    return this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
  public async patchUser(userFields: any) {
    const user: any = await this.User.findById(userFields.id);
    if (user) {
      for (const i in userFields) {
        user[i] = userFields[i];
      }
      return await user.save();
    }
  }
}
