import { AxiosError } from "axios";

export const handleAxiosError = (error: unknown, ERRORS: Record<string, string>) => {
  if (error instanceof AxiosError) {
    const responseError = error.response?.data?.error;
    const errorCode = responseError.code;
    const message = ERRORS[errorCode];
    return message;
  }

  return ERRORS.default;
};
