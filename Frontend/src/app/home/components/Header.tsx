"use client";

import { folderRequests } from "@/requests/FolderRequests";
import { CreateFolder, Folder } from "@/requests/interfaces/folderInterface";
import { User } from "@/requests/interfaces/userInterface";
import { useState } from "react";
import { produce } from "immer";
import { INotification } from "@/components/Notification";

interface HeaderProps {
  props: {
    folders: Folder[];
    setFolders: (state: Folder[]) => void;
    setNotification: (state: INotification) => void;
  };
}

export const Header = ({ props: { folders, setFolders, setNotification } }: HeaderProps) => {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");

  const createFolder = async () => {
    if (!name) return;

    const user: User = JSON.parse(localStorage.getItem("user") || "");
    const folderData: CreateFolder = { userId: user.id, name };

    const { data, error } = await folderRequests.create(folderData);

    if (error) return setNotification({ type: "error", message: error, open: true });

    const newState = produce(folders, (draft) => {
      draft.push(data);
    });

    setNotification({ type: "success", message: "Sua nova pasta foi criada", open: true });
    setFolders(newState);
    setName("");
  };

  return (
    <div className="flex justify-between p-10 h-[180] items-start">
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
              data-testid="folderNameInput"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="bg-white text-black border-l-royal-blue border-l-10 px-4 py-2 rounded-xs capitalize mr-4"
              type="text"
            />

            <button className="bg-white text-black px-4" data-testid="createFolderButton">
              Criar
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
