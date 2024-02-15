import {Champion} from "./champion";

export interface ChampionResponse {
  type: string;
  format: string;
  version: string;
  data: { [key: string]: Champion };
}
