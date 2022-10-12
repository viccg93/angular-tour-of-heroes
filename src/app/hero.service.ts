import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

/**
 * decorador que indica que el servicio usara inyeccion de dependencias
 */
@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(
    private messageservice: MessageService,
    private httpClient: HttpClient) { }

  private heroesEndpoint = 'http://localhost/';

  /*getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES);
    this.messageservice.add('Hero Service: heroes fetched');
    return heroes;
  }*/

  getHeroes(): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(this.heroesEndpoint).pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: Number): Observable<Hero> {
    const hero = HEROES.find(h => h.id === id)!;
    this.messageservice.add(`HeroService: fetched hero: ${hero.id}`);
    return of(hero);
  }

  private log(message: string) {
    this.messageservice.add(`HeroService: ${message}`);
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
