import axios from "axios";
import { FOLDER_ERRORS } from "./errors/folderErrors";
import { handleAxiosError } from "./utils/handleAxiosErrors";

class WordRequests {
  private URL = `${process.env.NEXT_PUBLIC_URL}/word`;

  async getWords(folderId: string) {
    try {
      const { data } = await axios.get(`${this.URL}/${folderId}`, { withCredentials: true });
      return { data };
    } catch (error) {
      return { error: handleAxiosError(error, FOLDER_ERRORS) };
    }
  }
}

export const wordRequests = new WordRequests();
