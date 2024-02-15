import {Skin} from "./skin";

export interface Champion {
  id: string;
  name: string;
  skins: Skin[];
}
