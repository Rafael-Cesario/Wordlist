import request from "supertest";
import { app } from "../app";
import type { CreateUser } from "../interfaces/userInterface";
import { prisma } from "../prisma";
import { USER_ERRORS } from "../helpers/errors/userErrors";

describe("User", () => {
  describe("Create User", () => {
    afterEach(async () => {
      await prisma.user.deleteMany();
    });

    const createUser = async (user: Partial<CreateUser>) => {
      const route = "/user";
      const res = await request(app).post(route).send(user);
      return res;
    };

    it("Should fail if request body is empty", async () => {
      const res = await createUser({});

      expect(res.status).toBe(400);
      expect(res.body.email[0]).toContain("Invalid input:");
      expect(res.body.name[0]).toContain("Invalid input:");
      expect(res.body.password[0]).toContain("Invalid input:");
    });

    it("Should fail if fields are empty strings", async () => {
      const user = { email: "", name: "", password: "" };
      const res = await createUser(user);

      expect(res.status).toBe(400);
      expect(res.body.email[0]).toContain("Invalid");
      expect(res.body.name[0]).toContain("expected string to have >=1 characters");
      expect(res.body.password[0]).toContain("expected string to have >=1 characters");
    });

    it("Should fail if email is not valid", async () => {
      const user = { email: "NotValid", name: "ok", password: "ok" };
      const res = await createUser(user);

      expect(res.status).toBe(400);
      expect(res.body.email[0]).toBe("Invalid email address");
    });

    it("Should save email in lowercase", async () => {
      const user = { email: "USER01@EMAIL.COM", name: "user01", password: "123" };
      const res = await createUser(user);
      const id = res.body.id;
      const userDB = await prisma.user.findUnique({ where: { id } });

      expect(userDB!.email).toBe(user.email.toLowerCase());
    });

    it("Should save password as a hash", async () => {
      const user = { email: "user01@email.com", name: "user01", password: "123" };
      const res = await createUser(user);
      const id = res.body.id;
      const userDB = await prisma.user.findUnique({ where: { id } });

      expect(userDB?.password).not.toBe(user.password);
    });

    it("Should fail if user already exist", async () => {
      const user = { email: "user01@email.com", name: "user01", password: "123" };

      await createUser(user);
      const res = await createUser(user);

      expect(res.status).toBe(400);
      expect(res.body.error).toStrictEqual(USER_ERRORS.uniqueConstraint);
    });

    it("Should remove password from the response", async () => {
      const user = { email: "user01@email.com", name: "user01", password: "123" };
      const res = await createUser(user);

      expect(res.status).toBe(201);
      expect(res.body).not.toHaveProperty("password");
    });

    it("Should create a new user", async () => {
      const user = { email: "user01@email.com", name: "user01", password: "123" };
      const res = await createUser(user);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        id: expect.any(String),
        email: user.email,
        name: user.name,
        createdAt: expect.any(String),
      });
    });
  });
});
