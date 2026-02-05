"use client";

import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { FOLDER_KEY } from "@/utils/storageKeys";
import { wordRequests } from "@/requests/wordRequests";
import { Word } from "@/requests/interfaces/wordInterface";
import { CreateWord } from "./components/CreateWord";
import { WordsContainer } from "./components/WordsContainer";
import type { Folder } from "@/requests/interfaces/folderInterface";

export default function Folder() {
  const [folder, setFolder] = useState<Folder>({ id: "", name: "", userId: "" });
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    const loadWords = async () => {
      const folder: Folder = JSON.parse(`${localStorage.getItem(FOLDER_KEY)}`);

      const { data, error } = await wordRequests.getWords(folder.id);
      if (error) return console.log(error);

      setFolder(folder);
      setWords(data.words);
    };

    loadWords();
  }, []);

  return (
    <>
      <Header props={{ folder, words }} />
      <CreateWord props={{ words, setWords, folder }} />
      <WordsContainer props={{ words }} />
    </>
  );
}
