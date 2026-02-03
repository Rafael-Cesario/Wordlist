import request from "supertest";
import { faker } from "@faker-js/faker";
import { generateToken } from "../../helpers/token";
import { app } from "../../app";
import type { CreateWord } from "../../interfaces/wordInterface";

export const createWord = async (data: Partial<CreateWord>) => {
  const route = "/word";
  const token = generateToken(faker.string.uuid());

  const response = await request(app)
    .post(route)
    .set("Cookie", [`authentication=${token}`])
    .send(data);

  return response;
};
