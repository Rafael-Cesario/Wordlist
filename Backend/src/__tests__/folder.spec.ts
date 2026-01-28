import request from "supertest";
import jwt from "jsonwebtoken";
import type { CreateFolder, Folder, UpdateFolder } from "../interfaces/folderInterface";
import type { User } from "../interfaces/userInterface";
import { randomUUID } from "node:crypto";
import { app } from "../app";
import { USER_ERRORS } from "../helpers/errors/userErrors";
import { prisma } from "../prisma";
import { generateToken } from "../helpers/token";
import { AUTH_ERRORS } from "../helpers/errors/authErrors";
import { FOLDER_ERRORS } from "../helpers/errors/folderErrors";

describe("Folder Route", () => {
  const route = "/folder";
  const token = generateToken("123");
  let user: User;

  beforeAll(async () => {
    const data = { email: "user01@email.com", name: "user01", password: "123" };
    user = await prisma.user.create({ data });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
  });

  const createFolder = async (data: Partial<CreateFolder>) => {
    const res = await request(app)
      .post(route)
      .set("Cookie", [`authentication=${token}`])
      .send(data);

    return res;
  };

  const readAllFolder = async (userId: string) => {
    const res = await request(app)
      .get(`${route}/${userId}`)
      .set("Cookie", [`authentication=${token}`]);

    return res;
  };

  const updateFolder = async (data: Partial<UpdateFolder>) => {
    const res = await request(app)
      .put(route)
      .set("Cookie", [`authentication=${token}`])
      .send(data);

    return res;
  };

  describe("Create Folder", () => {
    afterEach(async () => {
      await prisma.folder.deleteMany({});
    });

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

    it("Should fail if auth cookies are not found", async () => {
      const res = await request(app).post(route).send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toStrictEqual(AUTH_ERRORS.cookiesNotFound);
    });

    it("Should fail if token is not valid", async () => {
      const notValidToken = jwt.sign({}, "invalid");

      const res = await request(app)
        .post(route)
        .set("Cookie", [`authentication=${notValidToken}`])
        .send({});

      expect(res.status).toBe(403);
      expect(res.body.error).toStrictEqual(AUTH_ERRORS.invalidSignature);
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

  describe("Real all", () => {
    it("Should fail if user does not exist", async () => {
      const res = await readAllFolder("123");

      expect(res.body.error).toStrictEqual(USER_ERRORS.notFound);
    });

    it("Should return all user's folder", async () => {
      const folder = { name: "folder 01", userId: user.id };

      await createFolder(folder);
      const res = await readAllFolder(user.id);

      expect(res.body.userId).toBe(user.id);
      expect(res.body.totalFolders).toBe(1);
      expect(res.body.folders).toHaveLength(1);
      expect(res.body.folders[0].name).toBe(folder.name);
      expect(res.status).toBe(200);
    });
  });

  describe("Update", () => {
    let folder: Folder;

    beforeAll(async () => {
      const data = { userId: user.id, name: "folder 01" };
      const res = await createFolder(data);
      folder = res.body;
    });

    afterAll(async () => {
      await prisma.folder.deleteMany();
    });

    it("Should fail if fields are empty", async () => {
      const { body } = await updateFolder({});
      const { id, userId, name } = body;

      expect(id[0]).toContain("undefined");
      expect(userId[0]).toContain("undefined");
      expect(name[0]).toContain("undefined");
    });

    it("Should fail if fields are invalid", async () => {
      const invalidFields: UpdateFolder = { id: "123", name: "", userId: "456" };
      const res = await updateFolder(invalidFields);

      expect(res.body.id[0]).toContain("Invalid");
      expect(res.body.userId[0]).toContain("Invalid");
      expect(res.body.name[0]).toContain("Too small");
    });

    it("Should fail if folder does not exist", async () => {
      const data = { id: randomUUID(), name: "folder 01", userId: user.id };
      const res = await updateFolder(data);

      expect(res.body.error).toStrictEqual(FOLDER_ERRORS.notFound);
    });

    it("Should fail if user does not exist", async () => {
      const data = { id: folder.id, name: folder.name, userId: randomUUID() };
      const res = await updateFolder(data);

      expect(res.body.error).toStrictEqual(USER_ERRORS.notFound);
    });

    it("Should update a folder", async () => {
      const data = { id: folder.id, name: "new name", userId: folder.userId };

      const res = await updateFolder(data);
      const folderOnDatabase = await prisma.folder.findUnique({ where: { id: res.body.id } });

      expect(folderOnDatabase?.name).toBe(data.name);
    });
  });
});
