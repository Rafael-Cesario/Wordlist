export class CustomError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const USER_ERRORS = {
  uniqueConstraint: "U100: Unique constraint failed on the field email",
};

export const AUTH_ERRORS = {
  invalidCredentials: "A100: Invalid credentials, the email or password provided are incorrect.",
};
