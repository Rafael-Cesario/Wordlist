export interface ICustomError {
  code: string;
  message: string;
}

export class CustomError extends Error {
  readonly code: string;

  constructor({ code, message }: ICustomError) {
    super(message);
    this.code = code;
  }
}
