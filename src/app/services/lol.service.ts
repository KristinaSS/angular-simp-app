import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, tap} from "rxjs";
import {Champion} from "../models/champion";

@Injectable({
  providedIn: 'root'
})
export class LolService {
  private champsWithsSkinsURLs = 'https://my-reverse-proxy.krisagriza.workers.dev/';

  constructor(private http: HttpClient) {
  }

  getChampionsAndSkins(): Observable<Champion[]> {
    return this.http.get<any>(this.champsWithsSkinsURLs).pipe(
      tap(data => console.log('Champ API Response:', data)),
      catchError(error => {
        console.error('Error fetching champs and skins:', error);
        return [];
      })
    );
  }
}
