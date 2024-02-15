import {Skin} from "./skin";

export interface Champion {
  id: string;
  name: string;
  title: string;
  icon: string;
  releaseDate: string;
  skins: Skin[];
}
