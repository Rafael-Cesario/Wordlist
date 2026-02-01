import request from "supertest";
import type { Login } from "../interfaces/authInterface";
import { app } from "../app";
import { AUTH_ERRORS } from "../helpers/errors/authErrors";
import { prisma } from "../prisma";
import { hashPassword } from "../helpers/hashPassword";
import { generateToken } from "../helpers/token";

describe("Auth Service", () => {
  const route = "/auth";

  const login = async (data: Partial<Login>) => {
    const res = await request(app).post(route).send(data);

    return res;
  };

  const validateToken = async (token: string) => {
    const res = await request(app)
      .post(route + "/validate")
      .send({ token });

    return res;
  };

  describe("Login", () => {
    const user = { email: "user@email.com", name: "user", password: "1234" };

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

  describe("Validate token", () => {
    it("Should fail if token is not valid", async () => {
      const invalidToken = `
        eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
        eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.
        KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30`;

      const res = await validateToken(invalidToken);

      expect(res.body.error).toStrictEqual(AUTH_ERRORS.invalidSignature);
    });

    it("Should respond with a authorized message", async () => {
      const id = "123";
      const token = generateToken(id);

      const res = await validateToken(token);

      expect(res.body.message).toBe("Authorized");
    });
  });
});
