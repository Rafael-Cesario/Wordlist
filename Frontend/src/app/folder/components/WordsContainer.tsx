"use client";

import { Word } from "@/requests/interfaces/wordInterface";
import { useEffect, useState } from "react";

interface WordsContainerProps {
  props: {
    words: Word[];
  };
}

export const WordsContainer = ({ props: { words } }: WordsContainerProps) => {
  const [groups, setGroups] = useState<Word[][]>([]);

  useEffect(() => {
    const separateGroups = () => {
      const groupWords: Word[][] = [];
      const wordsPerGroup = 40;
      const totalGroups = Math.ceil(words.length / wordsPerGroup);

      for (let currentGroup = 0; currentGroup < totalGroups; currentGroup++) {
        const start = currentGroup * wordsPerGroup;
        const end = wordsPerGroup * (currentGroup + 1);

        const group = words.slice(start, end);

        groupWords.push(group);
      }

      setGroups(groupWords);
    };

    separateGroups();
  }, [words]);

  return (
    <div className="flex flex-wrap justify-center my-40 mx-10">
      {groups.map((group, index) => {
        return (
          <div
            className="bg-faded border-t-2 rounded-sm border-royal-blue items-center flex flex-col m-4 p-10 cursor-pointer hover:scale-105 transition transform duration-50"
            key={index}
          >
            <h1 className="mb-4">{index + 1}</h1>

            <div className="flex flex-wrap w-70">
              {group.map((word) => {
                return (
                  <p className="m-1" key={word.id}>
                    {word.word}
                  </p>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
