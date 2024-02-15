import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Champion} from "../models/champion";
import {Skin} from "../models/skin";

@Injectable({
  providedIn: 'root'
})
export class LolService {
  private readonly apiUrl = 'https://ddragon.leagueoflegends.com/cdn/14.3.1/data/en_US';
  private readonly allChampsPath = '/champion.json';

  constructor(private http: HttpClient) {
  }

  getAllChampions(): Observable<Champion[]> {
    return this.http.get<any>(this.apiUrl + this.allChampsPath).pipe(
      map((response: any) => {
        const champions: Champion[] = [];
        const championData = response.data;
        for (const key in championData) {
          if (championData.hasOwnProperty(key)) {
            const champion = championData[key];
            champions.push({ id: champion.key, name: champion.name, skins: [] });
          }
        }
        return champions; // Return the array of champions
      })
    );
  }


  getChampionSkins(championName: string): Observable<Skin[]> {
    return this.http.get<any>(this.apiUrl + `/champion/${championName}.json`).pipe(
      map((response: any) => {
        const championData = response.data[championName];
        if (championData && championData.skins) {
          return championData.skins.map((skin: any) => ({
            id: skin.id,
            num: skin.num,
            name: skin.name,
            chromas: skin.chromas
          }));
        }
        return [];
      })
    );
  }
}
