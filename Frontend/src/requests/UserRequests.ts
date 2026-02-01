import axios from "axios";
import { CreateUser } from "@/requests/interfaces/userInterface";
import { USER_ERRORS } from "./errors/userErrors";
import { handleAxiosError } from "./utils/handleAxiosErrors";

class UserRequests {
  private URL = `${process.env.NEXT_PUBLIC_URL}/user`;

  async create(user: CreateUser) {
    try {
      const { data } = await axios.post(this.URL, user);
      return { data };
    } catch (error) {
      return { error: handleAxiosError(error, USER_ERRORS) };
    }
  }
}

export const userRequests = new UserRequests();
