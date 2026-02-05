import { Folder } from "@/requests/interfaces/folderInterface";
import { Word } from "@/requests/interfaces/wordInterface";
import Link from "next/link";

interface HeaderProps {
  props: {
    folder: Folder;
    words: Word[];
  };
}

export const Header = ({ props: { folder, words } }: HeaderProps) => {
  return (
    <div className="grid grid-cols-3 mt-10 mx-8 h-15">
      <div>
        <Link className="mr-4" href={"/home"}>
          Voltar
        </Link>

        <button>Configurações</button>
      </div>

      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold capitalize">{folder.name}</h1>
        <p>Total de Palavras: {words.length}</p>
      </div>
    </div>
  );
};
