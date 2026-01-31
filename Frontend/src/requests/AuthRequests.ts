import axios from "axios";
import { AUTH_ERRORS } from "./errors/authErrors";
import { Login } from "@/interfaces/userInterface";
import { handleAxiosError } from "./utils/handleAxiosErrors";

class AuthRequests {
  private URL = `${process.env.NEXT_PUBLIC_URL}/auth`;

  async login(user: Login) {
    try {
      const { data } = await axios.post(this.URL, user, { withCredentials: true });
      return { data };
    } catch (error) {
      return { error: handleAxiosError(error, AUTH_ERRORS) };
    }
  }
}

export const authRequests = new AuthRequests();
