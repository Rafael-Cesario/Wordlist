import axios, { AxiosError } from "axios";
import { CreateUser } from "@/interfaces/userInterface";
import { USER_ERRORS } from "./errors/userErrors";

class UserRequests {
  private baseURL = `${process.env.NEXT_PUBLIC_URL}`;

  private handleAxiosError(error: unknown) {
    if (error instanceof AxiosError) {
      const responseError = error.response?.data?.error;
      const errorCode = responseError.split(":")[0];
      const message = USER_ERRORS[errorCode as keyof typeof USER_ERRORS];
      return message;
    }

    return USER_ERRORS.default;
  }

  async create(user: CreateUser) {
    const url = `${this.baseURL}/user`;

    try {
      const { data } = await axios.post(url, user);
      return { data };
    } catch (error) {
      return { error: this.handleAxiosError(error) };
    }
  }
}

export const userRequests = new UserRequests();
