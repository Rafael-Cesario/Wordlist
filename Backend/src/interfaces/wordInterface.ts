export interface Word {
  id: string;
  folderId: string;
  word: string;
  definition: string;
}

export interface CreateWord {
  folderId: string;
  word: string;
  definition: string;
}

export interface UpdateWord {
  id: string;
  folderId: string;
  word: string;
  definition: string;
}
