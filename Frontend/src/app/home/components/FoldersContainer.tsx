"use client";

import { Folder } from "@/requests/interfaces/folderInterface";
import { FOLDER_KEY } from "@/utils/storageKeys";
import { useRouter } from "next/navigation";

interface FoldersContainerProps {
  props: {
    folders: Folder[];
  };
}

export const FoldersContainer = ({ props: { folders } }: FoldersContainerProps) => {
  const router = useRouter();

  const enterFolder = (folder: Folder) => {
    localStorage.setItem(FOLDER_KEY, JSON.stringify(folder));
    router.push("/folder");
  };

  return (
    <div className="grid grid-cols-3 gap-4 my-20 mx-30" data-testid="foldersContainer">
      {folders.map((folder) => {
        return (
          <button
            onClick={() => enterFolder(folder)}
            className="bg-white text-center text-black border-l-royal-blue border-l-10 px-8 py-4 h-[50] rounded-xs capitalize"
            key={folder.id}
          >
            {folder.name}
          </button>
        );
      })}
    </div>
  );
};
