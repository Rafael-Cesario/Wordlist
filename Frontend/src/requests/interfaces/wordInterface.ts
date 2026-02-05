export interface Word {
  id: string;
  folderId: string;
  word: string;
  definition: string;
}

export interface ICreateWord {
  folderId: string;
  word: string;
  definition: string;
}
