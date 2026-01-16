export interface CreateUser {
  email: string;
  name: string;
  password: string;
  passwordCheck: string;
}

export interface Login {
  email: string;
  password: string;
}
