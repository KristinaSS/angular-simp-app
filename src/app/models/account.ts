import { SkinDetails } from './skin-details';

export class Account {
  constructor(
    public id: string,
    public skins: SkinDetails[]
  ) {}
}
