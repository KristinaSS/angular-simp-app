import { Skin } from './skin';

export class Champion {
  constructor(
    public id: string,
    public name: string,
    public title: string,
    public icon: string,
    public releaseDate: string,
    public skins: Skin[],
    public showOtherSkins: boolean
  ) {}
}
