import request from "supertest";
import { faker } from "@faker-js/faker";
import { app } from "../app";
import { AUTH_ERRORS } from "../helpers/errors/authErrors";
import { WORD_ERRORS } from "../helpers/errors/wordErrors";
import { createFolder, createUser, resetDatabase } from "./utils/database";
import { createWord } from "./utils/requests";
import type { CreateWord } from "../interfaces/wordInterface";
import type { Folder } from "../interfaces/folderInterface";
import type { User } from "../interfaces/userInterface";

describe("Word", () => {
  let user: User;
  let folder: Folder;

  beforeAll(async () => {
    user = await createUser();
    folder = await createFolder(user);
  });

  afterAll(async () => {
    await resetDatabase();
  });

  describe("Protected routes", () => {
    const route = "/word";

    it("Should fail if user is not authenticated", async () => {
      const create = await request(app).post(route).send({});
      const read = await request(app).get(`${route}/${faker.string.uuid()}`);

      expect(create.body.error).toStrictEqual(AUTH_ERRORS.cookiesNotFound);
      expect(read.body.error).toStrictEqual(AUTH_ERRORS.cookiesNotFound);
    });

    it("Should fail if token is not valid", async () => {
      const invalidToken = faker.internet.jwt();

      const create = await request(app)
        .post(route)
        .set("Cookie", [`authentication=${invalidToken}`])
        .send({});

      const read = await request(app)
        .post(`${route}/${faker.string.uuid()}`)
        .set("Cookie", [`authentication=${invalidToken}`]);

      expect(create.body.error).toStrictEqual(AUTH_ERRORS.invalidSignature);
      expect(read.body.error).toStrictEqual(AUTH_ERRORS.invalidSignature);
    });
  });

  describe("Create Word", () => {
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

  // describe("Read all words", () => {});
});
