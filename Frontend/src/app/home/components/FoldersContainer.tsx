"use client";

import { Folder } from "@/requests/interfaces/folderInterface";

interface FoldersContainerProps {
  props: {
    folders: Folder[];
  };
}

export const FoldersContainer = ({ props: { folders } }: FoldersContainerProps) => {
  return (
    <div className="grid grid-cols-5 gap-4 mx-100 my-50" data-testid="foldersContainer">
      {folders.map((folder) => {
        return (
          <button
            className="bg-white text-black border-l-royal-blue border-l-20 px-8 py-4 rounded-xs capitalize"
            key={folder.id}
          >
            {folder.name}
          </button>
        );
      })}
    </div>
  );
};
