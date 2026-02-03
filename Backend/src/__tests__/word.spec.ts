import request from "supertest";
import { faker } from "@faker-js/faker";
import { generateToken } from "../helpers/token";
import { app } from "../app";
import { AUTH_ERRORS } from "../helpers/errors/authErrors";
import { WORD_ERRORS } from "../helpers/errors/wordErrors";
import { prisma } from "../prisma";
import type { CreateWord } from "../interfaces/wordInterface";
import type { Folder } from "../interfaces/folderInterface";
import type { User } from "../interfaces/userInterface";

describe("Word", () => {
  const route = "/word";
  const token = generateToken(faker.string.uuid());

  const createWord = async (data: Partial<CreateWord>) => {
    const response = await request(app)
      .post(route)
      .set("Cookie", [`authentication=${token}`])
      .send(data);

    return response;
  };

  const createUser = async () => {
    return await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.internet.username(),
        password: faker.internet.password(),
      },
    });
  };

  const createFolder = async (user: User) => {
    return await prisma.folder.create({
      data: {
        name: faker.lorem.word(),
        userId: user.id,
      },
    });
  };

  const resetDatabase = async () => {
    await prisma.user.deleteMany();
  };

  describe("Create Word", () => {
    let user: User;
    let folder: Folder;

    beforeAll(async () => {
      user = await createUser();
      folder = await createFolder(user);
    });

    afterAll(async () => {
      await resetDatabase();
    });

    it("Should fail if user is not authenticated", async () => {
      const response = await request(app).post(route).send({});

      expect(response.body.error).toStrictEqual(AUTH_ERRORS.cookiesNotFound);
    });

    it("Should fail if token is not valid", async () => {
      const invalidToken = faker.internet.jwt();

      const response = await request(app)
        .post(route)
        .set("Cookie", [`authentication=${invalidToken}`])
        .send({});

      expect(response.body.error).toStrictEqual(AUTH_ERRORS.invalidSignature);
    });

    it("Should fail if body is invalid", async () => {
      const data: CreateWord = { folderId: "1", word: "", definition: "" };

      const response = await createWord(data);

      expect(response.body).toStrictEqual({
        folderId: ["Invalid UUID"],
        word: ["Too small: expected string to have >=1 characters"],
        definition: ["Too small: expected string to have >=1 characters"],
      });
    });

    it("Should fail if folder does not exist", async () => {
      const data: CreateWord = {
        folderId: faker.string.uuid(),
        word: faker.word.words(),
        definition: faker.word.words(),
      };

      const response = await createWord(data);

      expect(response.body.error).toStrictEqual(WORD_ERRORS.folderNotFound);
    });

    it("Should add a new word", async () => {
      const data: CreateWord = {
        folderId: folder.id,
        word: faker.word.words(),
        definition: faker.word.words(),
      };

      const response = await createWord(data);

      expect(response.body).toMatchObject({ id: expect.any(String), ...data });
    });
  });
});
