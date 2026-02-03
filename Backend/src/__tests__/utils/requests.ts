import request from "supertest";
import { faker } from "@faker-js/faker";
import { generateToken } from "../../helpers/token";
import { app } from "../../app";
import type { CreateWord } from "../../interfaces/wordInterface";

const route = "/word";
const token = generateToken(faker.string.uuid());

export const createWord = async (data: Partial<CreateWord>) => {
  const response = await request(app)
    .post(route)
    .set("Cookie", [`authentication=${token}`])
    .send(data);

  return response;
};

export const readAllWords = async (folderId: string) => {
  const response = await request(app)
    .get(`${route}/${folderId}`)
    .set("Cookie", [`authentication=${token}`]);

  return response;
};
