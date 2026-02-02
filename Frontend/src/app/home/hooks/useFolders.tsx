import { folderRequests } from "@/requests/FolderRequests";
import { Folder } from "@/requests/interfaces/folderInterface";
import { useEffect, useState } from "react";

const USER_KEY = "user";

export const useFolders = (initialState: Folder[]) => {
  const [folders, setFolders] = useState(initialState);

  useEffect(() => {
    const loadFolders = async () => {
      const user = JSON.parse(localStorage.getItem(USER_KEY) || "{}");
      const { data } = await folderRequests.getFolders(user.id);

      setFolders(data.folders);
    };

    loadFolders();
  }, []);

  return [folders, setFolders] as const;
};
