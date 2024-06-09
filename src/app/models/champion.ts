import {Skin} from "./skin";

export class Champion {
  id: string;
  name: string;
  title: string;
  icon: string;
  releaseDate: string;
  skins: Skin[];
  showOtherSkins: boolean;


  constructor(id: string, name: string, title: string, icon: string, releaseDate: string, skins: Skin[], showOtherSkins: boolean) {
    this.id = id;
    this.name = name;
    this.title = title;
    this.icon = icon;
    this.releaseDate = releaseDate;
    this.skins = skins;
    this.showOtherSkins = showOtherSkins;
  }
}
