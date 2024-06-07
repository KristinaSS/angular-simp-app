import {SkinDetails} from "./skin-details";

export class Account {
  id: string;
  skins: SkinDetails[];

  constructor(id: string, skins: SkinDetails[]) {
    this.id = id;
    this.skins = skins;
  }
}
