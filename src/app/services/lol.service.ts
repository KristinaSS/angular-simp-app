import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, of } from 'rxjs';
import { Champion } from '../models/champion';

@Injectable({
  providedIn: 'root'
})
export class LolService {
  private readonly champsWithSkinsURL = 'https://my-reverse-proxy.krisagriza.workers.dev/';

  constructor(private http: HttpClient) {}

  getChampionsAndSkins(): Observable<Champion[]> {
    return this.http.get<Champion[]>(this.champsWithSkinsURL).pipe(
      tap(data => console.log('[LolService] Fetched champions and skins:', data)),
      catchError(error => {
        console.error('[LolService] Failed to fetch champions:', error);
        return of([]); // return observable of empty array to keep app running
      })
    );
  }
}
