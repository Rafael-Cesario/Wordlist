"use client";

import { useState } from "react";
import { FoldersContainer } from "./components/FoldersContainer";
import { Header } from "./components/Header";
import { Folder } from "@/requests/interfaces/folderInterface";

export default function Home() {
  const [folders, setFolders] = useState<Folder[]>([]);

  return (
    <>
      <Header props={{ folders, setFolders }} />
      <FoldersContainer props={{ folders }} />
    </>
  );
}
