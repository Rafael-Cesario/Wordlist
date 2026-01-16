import axios, { AxiosError } from "axios";
import { AUTH_ERRORS } from "./errors/authErrors";
import { Login } from "@/interfaces/userInterface";

class AuthRequests {
  private URL = `${process.env.NEXT_PUBLIC_URL}/auth`;

  private handleAxiosError(error: unknown) {
    if (error instanceof AxiosError) {
      const responseError = error.response?.data?.error;
      const errorCode = responseError.split(":")[0];
      const message = AUTH_ERRORS[errorCode as keyof typeof AUTH_ERRORS];
      return message;
    }

    return AUTH_ERRORS.default;
  }

  async login(user: Login) {
    try {
      const { data } = await axios.post(this.URL, user);
      return { data };
    } catch (error) {
      return { error: this.handleAxiosError(error) };
    }
  }
}

export const authRequests = new AuthRequests();
