import { Injectable } from '@angular/core';
import { Jsonp, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LolService {

  constructor(private _jsonp: Jsonp) { }

  getChampionsAndSkins(): Observable<any> {
    return this._jsonp.request('https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions.json?callback=JSONP_CALLBACK')
      .pipe(
        map((res: Response) => res.json()),
        catchError(error => {
          console.error('Error fetching champs and skins:', error);
          return [];
        })
      );
  }
}
