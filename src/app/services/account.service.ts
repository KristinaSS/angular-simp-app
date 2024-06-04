import {Injectable} from '@angular/core';
import {Account} from "../models/account";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor() {
  }

  getAccount(): Account {
    return {
      id: "1",
      skins: [
        {
          id: "81003", //frostes ezreal
          isOwned: true,
          isLiked: true,
        },
        {
          id: "145048", //inkshadow kaisa
          isOwned: true,
          isLiked: true,
        },
        {
          id: "10004",
          isOwned: true,
          isLiked: true,
        },
        {
          id: "950001",
          isOwned: true,
          isLiked: true,
        },
        {
          id: "33008",
          isOwned: true,
          isLiked: true,
        },
        {
          id: "517024",
          isOwned: true,
          isLiked: true,
        },
        {
          id: "498037",
          isOwned: true,
          isLiked: true,
        },
        {
          id: "115014",
          isOwned: true,
          isLiked: true,
        },
        {
          id: "266001",//justicar aatrox
          isOwned: true,
          isLiked: true,
        },
        // Wanted
        {
          id: "1005", //frostfire annie
          isOwned: false,
          isLiked: true,
        },
        {
          id: "67055", //dragonmancer vayne
          isOwned: false,
          isLiked: true,
        },
        {
          id: "15050", //mythmaker sivir
          isOwned: false,
          isLiked: true,
        },
        {
          id: "895001",
          isOwned: false,
          isLiked: true,
        },
        {
          id: "222003",//zombie jinx
          isOwned: false,
          isLiked: true,
        },
      ],
    };

  }
}
