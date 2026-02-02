import axios from "axios";
import { CreateFolder } from "./interfaces/folderInterface";
import { handleAxiosError } from "./utils/handleAxiosErrors";
import { FOLDER_ERRORS } from "./errors/folderErrors";

class FolderRequests {
  private URL = `${process.env.NEXT_PUBLIC_URL}/folder`;

  async create(folder: CreateFolder) {
    try {
      const { data } = await axios.post(this.URL, folder, { withCredentials: true });
      return { data };
    } catch (error) {
      return { error: handleAxiosError(error, FOLDER_ERRORS) };
    }
  }

  async getFolders(userId: string) {
    try {
      const { data } = await axios.get(`${this.URL}/${userId}`, { withCredentials: true });
      return { data };
    } catch (error) {
      return { error: handleAxiosError(error, FOLDER_ERRORS) };
    }
  }
}

export const folderRequests = new FolderRequests();
