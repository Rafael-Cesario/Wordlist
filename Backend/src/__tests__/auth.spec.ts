import request from "supertest";
import type { Login } from "../interfaces/authInterface";
import { app } from "../app";
import { AUTH_ERRORS } from "../helpers/errors/authErrors";
import { prisma } from "../prisma";
import { hashPassword } from "../helpers/hashPassword";
import { validateToken } from "../helpers/token";

describe("Auth Service", () => {
  describe("Login", () => {
    const user = { email: "user@email.com", name: "user", password: "1234" };

    const login = async (data: Partial<Login>) => {
      const route = "/auth";
      const res = await request(app).post(route).send(data);
      return res;
    };

    beforeAll(async () => {
      const password = await hashPassword(user.password);
      await prisma.user.create({ data: { ...user, password } });
    });

    afterAll(async () => {
      await prisma.user.deleteMany();
    });

    it("Should fail if email is not valid", async () => {
      const res = await login({ email: "not valid", password: "123" });

      expect(res.body.email[0]).toBe("Invalid email address");
    });

    it("Should fail if password is an empty string", async () => {
      const res = await login({ email: "user01@email.com", password: "" });

      expect(res.body.password[0]).toBe("Too small: expected string to have >=1 characters");
    });

    it("Should fail if fields are empty", async () => {
      const res = await login({});

      expect(res.body.email[0]).toContain("Invalid");
      expect(res.body.password[0]).toContain("Invalid");
    });

    it("Should fail if didn't found the user", async () => {
      const res = await login({ email: "notfound@email.com", password: "123" });

      expect(res.body.error).toStrictEqual(AUTH_ERRORS.invalidCredentials);
    });

    it("Should fail if password is wrong", async () => {
      const res = await login({ email: user.email, password: "wrong" });

      expect(res.body.error).toStrictEqual(AUTH_ERRORS.invalidCredentials);
    });

    it("Should create an authentication cookie", async () => {
      const res = await login({ email: user.email, password: user.password });

      const cookies = res.headers["set-cookie"] as string[] | undefined;
      if (!cookies) throw new Error("Cookies not found");

      const authCookie = cookies[0] as string;
      const cookieName = authCookie.split("=")[0];

      expect(cookies).toHaveLength(1);
      expect(authCookie).toBeDefined();
      expect(authCookie).toContain("HttpOnly");
      expect(cookieName).toBe("authentication");
    });

    it("Should save the token on the cookies", async () => {
      const res = await login({ email: user.email, password: user.password });

      const cookies = res.headers["set-cookie"] as string[] | undefined;
      if (!cookies) throw new Error("Cookies not found");

      const authCookie = cookies[0] as string;
      const token = authCookie.substring(15, 202);
      const isValid = validateToken(token);

      expect(token).toBeDefined();
      expect(isValid).toBeTruthy();
    });

    it("Should respond with status 200 and an success message", async () => {
      const res = await login({ email: user.email, password: user.password });

      expect(res.status).toBe(200);
      expect(res.body.id).toBeDefined();
    });
  });
});
