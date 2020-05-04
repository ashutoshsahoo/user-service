import { expect } from "chai";
import { agent as request } from "supertest";
import app from "../../src/app";
import { JwtService } from "../jwt.service";

let firstUserIdTest = "";
const email= "test-user-email@gmail.com";
const maskedEmail = "tes************@gmail.com";
const firstUserBody = {
  name: "Test User",
  email: email,
  password: "Pass#your!word",
};

const jwt = {
  accessToken: "",
  refreshToken: "",
};

const adminJWT = JwtService.generateToken(2147483647);

it("should POST /users", async function () {
  const res = await request(app).post("/users").send(firstUserBody);
  expect(res.status).to.equal(201);
  expect(res.body).not.to.be.empty;
  expect(res.body).to.be.an("object");
  expect(res.body.id).to.be.an("string");
  firstUserIdTest = res.body.id;
});

it("should POST to /auth and retrieve an access token", async () => {
  const res = await request(app).post("/auth").send({
    email: firstUserBody.email,
    password: firstUserBody.password,
  });
  expect(res.status).to.equal(201);
  expect(res.body).not.to.be.empty;
  expect(res.body).to.be.an("object");
  expect(res.body.accessToken).to.be.an("string");
  expect(res.body.refreshToken).to.be.an("string");
  jwt.accessToken = res.body.accessToken;
  jwt.refreshToken = res.body.refreshToken;
});

it("should GET /users/:userId", async function () {
  const res = await request(app)
    .get(`/users/${firstUserIdTest}`)
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${jwt.accessToken}`)
    .send();
  expect(res.status).to.equal(200);
  expect(res.body).not.to.be.empty;
  expect(res.body).to.be.an("object");

  expect(res.body.name).to.be.equals(firstUserBody.name);
  expect(res.body.email).to.be.equals(maskedEmail);
  expect(res.body.permissionLevel).to.be.equals(1);
});

it("should GET /users", async function () {
  const res = await request(app)
    .get("/users")
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${adminJWT}`)
    .send();
  expect(res.status).to.equal(200);
  expect(res.body).not.to.be.empty;
  expect(res.body).to.be.an("array");

  expect(res.body[0].name).to.be.equals(firstUserBody.name);
  expect(res.body[0].email).to.be.equals(maskedEmail);
});

it("should PUT /users/:userId", async function () {
  const name = "Jose";
  const res = await request(app)
    .put(`/users/${firstUserIdTest}`)
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${jwt.accessToken}`)
    .send({
      name: name,
      email: firstUserBody.email,
    });
  expect(res.status).to.equal(204);
});

it("should GET /users/:userId to have a new name", async function () {
  const res = await request(app)
    .get(`/users/${firstUserIdTest}`)
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${jwt.accessToken}`)
    .send();
  expect(res.status).to.equal(200);
  expect(res.body).not.to.be.empty;
  expect(res.body).to.be.an("object");

  expect(res.body.name).to.be.not.equals(firstUserBody.name);
  expect(res.body.email).to.be.equals(maskedEmail);
});

it("should PATCH /users/:userId", async function () {
  const newField = { description: "My user description" };
  const res = await request(app)
    .patch(`/users/${firstUserIdTest}`)
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${jwt.accessToken}`)
    .send(newField);
  expect(res.status).to.equal(204);
});

it("should GET /users/:userId to have a new field called description", async function () {
  const res = await request(app)
    .get(`/users/${firstUserIdTest}`)
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${jwt.accessToken}`)
    .send();
  expect(res.status).to.equal(200);
  expect(res.body).not.to.be.empty;
  expect(res.body).to.be.an("object");
  expect(res.body.description).to.be.equals("My user description");
});

it("should DELETE /users/:userId", async function () {
  const res = await request(app)
    .delete(`/users/${firstUserIdTest}`)
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${jwt.accessToken}`)
    .send();
  expect(res.status).to.equal(204);
});

it("should GET /users and receive a 403 for not being an ADMIN", async function () {
  const res = await request(app)
    .get("/users")
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${jwt.accessToken}`)
    .send();
  expect(res.status).to.equal(403);
});
