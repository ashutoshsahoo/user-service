import { Application } from "express";

export abstract class CommonRoutes {
  protected app: Application;
  private name: string;

  public constructor(app: Application, name: string) {
    this.app = app;
    this.name = name;
    this.configureRoutes();
  }

  public getName() {
    return this.name;
  }

  protected abstract configureRoutes(): void;
}
