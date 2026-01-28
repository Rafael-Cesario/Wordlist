export interface Folder {
  id: string;
  userId: string;
  name: string;
}

export interface CreateFolder {
  name: string;
  userId: string;
}

export interface UpdateFolder {
  id: string;
  userId: string;
  name: string;
}
