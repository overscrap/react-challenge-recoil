import { atom } from "recoil";

const restoreState = (key: Keys) => {
  const state = localStorage.getItem(key);
  if (!state) return [];
  return JSON.parse(state);
};

export enum Keys {
  WANNA_GO = "WANNA_GO",
  HAVE_BEEN = "HAVE_BEEN",
  FAVS = "FAVS"
}

export type ICountry = {
  name: string;
  id: number;
};

export const wannaGoState = atom<ICountry[]>({
  key: Keys.WANNA_GO,
  default: restoreState(Keys.WANNA_GO)
});

export const haveBeenState = atom<ICountry[]>({
  key: Keys.HAVE_BEEN,
  default: restoreState(Keys.HAVE_BEEN)
});

export const favsState = atom<ICountry[]>({
  key: Keys.FAVS,
  default: restoreState(Keys.FAVS)
});
