"use client";

import { folderRequests } from "@/requests/FolderRequests";
import { CreateFolder, Folder } from "@/requests/interfaces/folderInterface";
import { User } from "@/requests/interfaces/userInterface";
import { useState } from "react";
import { produce } from "immer";

interface HeaderProps {
  props: {
    folders: Folder[];
    setFolders: (state: Folder[]) => void;
  };
}

export const Header = ({ props: { folders, setFolders } }: HeaderProps) => {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");

  const createFolder = async () => {
    if (!name) return;

    const user: User = JSON.parse(localStorage.getItem("user") || "");
    const folderData: CreateFolder = { userId: user.id, name };

    const { data } = await folderRequests.create(folderData);

    const newState = produce(folders, (draft) => {
      draft.push(data);
    });

    setFolders(newState);
    setName("");

    // Tasks
    // catch errors
  };

  return (
    <div className="flex justify-between px-8 py-4 items-start">
      <div>
        <h1 className="text-4xl font-bold">Wordlist</h1>
        <p className="text-neutral-500">Crie pastas para organizar suas palavras</p>
      </div>

      <div className="flex flex-col items-end">
        <button onClick={() => setShowCreate(!showCreate)} className="bg-royal-blue rounded-xs px-4 py-2">
          Criar Pasta
        </button>

        {showCreate && (
          <form onSubmit={(e) => (e.preventDefault(), createFolder())} className="flex mt-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="bg-white text-black border-l-royal-blue border-l-10 px-4 py-2 rounded-xs capitalize mr-4"
              type="text"
            />

            <button className="bg-white text-black px-4">Criar</button>
          </form>
        )}
      </div>
    </div>
  );
};
