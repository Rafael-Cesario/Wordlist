import type { ICreateWord, Word } from "@/requests/interfaces/wordInterface";
import { Folder } from "@/requests/interfaces/folderInterface";
import { wordRequests } from "@/requests/wordRequests";
import { produce } from "immer";
import { useRef, useState } from "react";

interface CreateWordProps {
  props: {
    folder: Folder;
    words: Word[];
    setWords: (state: Word[]) => void;
  };
}

export const CreateWord = ({ props: { words, setWords, folder } }: CreateWordProps) => {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");

  const wordInputRef = useRef<HTMLInputElement>(null);

  const addWord = async () => {
    if (!word || !definition) return;

    const newWord: ICreateWord = { folderId: folder.id, word, definition };
    const { data, error } = await wordRequests.createWord(newWord);

    // Task: handle error
    if (error) return console.log(error);

    const newState = produce(words, (draft) => {
      draft.push(data);
    });

    setWords(newState);

    setWord("");
    setDefinition("");

    wordInputRef.current?.focus();
  };

  return (
    <form onSubmit={(e) => (e.preventDefault(), addWord())} className="flex justify-center items-end mt-40">
      <div className="flex flex-col mr-8">
        <label className="ml-4 text-neutral-300" htmlFor="word">
          Palavra
        </label>
        <input
          ref={wordInputRef}
          autoComplete="false"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="bg-faded px-4 py-2 w-100 rounded-sm"
          type="text"
          id="word"
        />
      </div>

      <div className="flex flex-col mr-8">
        <label className="ml-4 text-neutral-300" htmlFor="definition">
          Definição
        </label>
        <input
          autoComplete="false"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          className="bg-faded px-4 py-2 w-100 rounded-sm"
          type="text"
          id="definition"
        />
      </div>

      <button className="bg-royal-blue h-10 px-4 rounded-sm">Adicionar palavra</button>
    </form>
  );
};
