"use client";

import { useState } from "react";
import { FoldersContainer } from "./components/FoldersContainer";
import { Header } from "./components/Header";
import { Folder } from "@/requests/interfaces/folderInterface";
import { INotification, Notification } from "../../components/Notification";

const notificationDefault: INotification = { type: "success", message: "", open: false };

export default function Home() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [notification, setNotification] = useState<INotification>(notificationDefault);

  return (
    <>
      <Notification props={{ notification, setNotification }} />
      <Header props={{ folders, setFolders, setNotification }} />
      <FoldersContainer props={{ folders }} />
    </>
  );
}
