import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, tap} from "rxjs";
import {ChampionResponse} from "../models/champion-response";

@Injectable({
  providedIn: 'root'
})
export class LolService {
  private readonly allChampsUrl = 'https://ddragon.leagueoflegends.com/cdn/14.3.1/data/en_US/champion.json';

  constructor(private http: HttpClient) {}

  getAllChampions(): Observable<ChampionResponse> {
    return this.http.get<any>(this.allChampsUrl).pipe(
      tap(data => console.log('All Champs API Response:', data)),
      catchError(error => {
        console.error('Error fetching champions:', error);
        return [];
      })
    );
  }
}
