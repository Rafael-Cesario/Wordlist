import axios from "axios";
import { handleAxiosError } from "./utils/handleAxiosErrors";
import { WORD_ERRORS } from "./errors/wordErrors";
import { ICreateWord } from "./interfaces/wordInterface";

class WordRequests {
  private URL = `${process.env.NEXT_PUBLIC_URL}/word`;

  async getWords(folderId: string) {
    try {
      const { data } = await axios.get(`${this.URL}/${folderId}`, { withCredentials: true });
      return { data };
    } catch (error) {
      return { error: handleAxiosError(error, WORD_ERRORS) };
    }
  }

  async createWord(word: ICreateWord) {
    try {
      const { data } = await axios.post(this.URL, word, { withCredentials: true });
      return { data };
    } catch (error) {
      return { error: handleAxiosError(error, WORD_ERRORS) };
    }
  }
}

export const wordRequests = new WordRequests();
