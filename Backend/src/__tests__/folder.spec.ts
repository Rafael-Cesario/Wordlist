import request from "supertest";
import type { CreateFolder } from "../interfaces/folderInterface";
import type { User } from "../interfaces/userInterface";
import { randomUUID } from "node:crypto";
import { app } from "../app";
import { USER_ERRORS } from "../helpers/errors/userErrors";
import { prisma } from "../prisma";

describe("Folder Route", () => {
  describe("Create Folder", () => {
    let user: User;

    beforeAll(async () => {
      user = await prisma.user.create({
        data: {
          email: "user01@email.com",
          name: "user01",
          password: "123",
        },
      });
    });

    afterEach(async () => {
      await prisma.folder.deleteMany({});
    });

    afterAll(async () => {
      await prisma.user.deleteMany({});
    });

    const createFolder = async (data: Partial<CreateFolder>) => {
      const route = "/folder";
      const res = await request(app).post(route).send(data);
      return res;
    };

    it("Should fail if request body is empty", async () => {
      const res = await createFolder({});

      expect(res.status).toBe(400);
      expect(res.body.name[0]).toContain("Invalid input");
      expect(res.body.userId[0]).toContain("Invalid input");
    });

    it("Should fail if userId is not an uuid", async () => {
      const res = await createFolder({ name: "folder 01", userId: "1234" });

      expect(res.status).toBe(400);
      expect(res.body.userId[0]).toContain("Invalid UUID");
    });

    it("Should fail if did not find an user", async () => {
      const res = await createFolder({ name: "folder 01", userId: randomUUID() });

      expect(res.status).toBe(400);
      expect(res.body.error).toStrictEqual(USER_ERRORS.notFound);
    });

    it("Should save on database", async () => {
      const folder = { name: "FOLDER 01", userId: user.id };
      await createFolder(folder);

      const allFolders = await prisma.folder.findMany({});

      expect(allFolders.length).toBe(1);

      expect(allFolders[0]).toMatchObject({
        id: expect.any(String),
        name: folder.name.toLowerCase(),
        userId: folder.userId,
      });
    });

    it("Should create a new folder", async () => {
      const folder = { name: "folder 01", userId: user.id };
      const res = await createFolder(folder);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ id: expect.any(String), ...folder });
    });
  });
});
