export class CommonPermissionMiddleware {
  public static MAX_PERMISSION = 4096 * 2;
  public static BASIC_PERMISSION = 1;
  public minimumPermissionLevelRequired(requiredPermissionLevel: any) {
    return (req: any, res: any, next: any) => {
      try {
        const userPermissionLevel = parseInt(req.jwt.permissionLevel);
        if (userPermissionLevel & Number.parseInt(requiredPermissionLevel)) {
          next();
        } else {
          res.status(403).send({});
        }
      } catch (e) {
        console.log(e);
      }
    };
  }
  public async onlySameUserOrAdminCanDoThisAction(
    req: any,
    res: any,
    next: any
  ) {
    const userPermissionLevel = parseInt(req.jwt.permissionLevel);
    const userId = req.jwt.userId;
    if (req.params && req.params.userId && userId === req.params.userId) {
      return next();
    } else {
      if (userPermissionLevel & CommonPermissionMiddleware.MAX_PERMISSION) {
        return next();
      } else {
        return res.status(403).send({});
      }
    }
  }
  public async onlyAdminCanDoThisAction(req: any, res: any, next: any) {
    const userPermissionLevel = parseInt(req.jwt.permissionLevel);
    if (userPermissionLevel & CommonPermissionMiddleware.MAX_PERMISSION) {
      return next();
    } else {
      return res.status(403).send({});
    }
  }
}
