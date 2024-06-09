export class SkinDetails {
  id: string;
  isOwned: boolean;
  isLiked: boolean;

  constructor(id: string, isOwned: boolean, isLiked: boolean) {
    this.id = id;
    this.isOwned = isOwned;
    this.isLiked = isLiked;
  }
}
