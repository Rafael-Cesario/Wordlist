export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
}

export type CreateUser = Pick<User, "email" | "name" | "password">;
