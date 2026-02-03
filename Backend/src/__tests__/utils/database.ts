import { faker } from "@faker-js/faker";
import { prisma } from "../../prisma";
import type { User } from "../../interfaces/userInterface";

export const createUser = async () => {
  return await prisma.user.create({
    data: {
      email: faker.internet.email(),
      name: faker.internet.username(),
      password: faker.internet.password(),
    },
  });
};

export const createFolder = async (user: User) => {
  return await prisma.folder.create({
    data: {
      name: faker.lorem.word(),
      userId: user.id,
    },
  });
};

export const resetDatabase = async () => {
  await prisma.user.deleteMany();
};
