import {Chroma} from "./chroma";
import {SkinDetails} from "./skin-details";

export interface Skin {
  id: string;
  name: string;
  isBase: boolean;
  availability: string;
  lootEligible: boolean;
  cost: string;
  sale: string;
  rarity: string;
  chromas: Chroma[];
  release: string;
  set: string[];
  splashPath: string;
  uncenteredSplashPath: string;
  tilePath: string;
  loadScreenPath: string;
  loadScreenVintagePath: string;
  cols: number;
  isLastColumn?: boolean;
  show?: boolean;

  skinDetails?: SkinDetails;
}
