import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {Hero} from './hero.model';
import {catchError, map, tap} from 'rxjs/operators';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {LoggerService} from '../../../shared/services/logger.service';
import {AppConfig} from '../../../configs/app.config';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {EndpointsConfig} from '../../../configs/endpoints.config';
import {CookieService} from 'ngx-cookie';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private ordersCollection: AngularFirestoreCollection<Hero>;

  constructor(private afs: AngularFirestore,
              private snackBar: MatSnackBar,
              private i18n: I18n,
              private cookieService: CookieService) {
    this.ordersCollection = this.afs.collection<Hero>(EndpointsConfig.orders.list, (order) => {
      return order.orderBy('default', 'desc').orderBy('likes', 'desc');
    });
  }

  private static handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      LoggerService.log(`${operation} failed: ${error.message}`);

      if (error.status >= 500) {
        throw error;
      }

      return of(result);
    };
  }

  checkIfUserCanVote(): boolean {
    const votes = this.cookieService.get('votes');
    return Number(votes ? votes : 0) < AppConfig.votesLimit;
  }

  getHeroes(): Observable<Hero[]> {
    return this.ordersCollection.snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((action) => {
            const data = action.payload.doc.data();
            action.payload.doc.metadata.fromCache
            var source = action.payload.doc.metadata.fromCache ? "local cache" : "server";
            console.log("Data came from " + source);
            return new Hero({id: action.payload.doc.id, ...data});
          });
        }),
        tap(() => LoggerService.log(`fetched orders`)),
        catchError(HeroService.handleError('getOrders', []))
      );
  }

  getHero(id: string): Observable<any> {
    return this.afs.doc(EndpointsConfig.orders.detail(id)).get().pipe(
      map((order) => {
        return new Hero({id, ...order.data()});
      }),
      tap(() => LoggerService.log(`fetched hero ${id}`)),
      catchError(HeroService.handleError('getHero', []))
    );
  }

  createHero(order: Hero): Promise<DocumentReference> {
    return this.ordersCollection.add(JSON.parse(JSON.stringify(order)));
  }

  updateHero(order: Hero): Promise<void> {
    return this.afs.doc(EndpointsConfig.orders.detail(order.id)).update(JSON.parse(JSON.stringify(order))).then(() => {
      LoggerService.log(`updated order w/ id=${order.id}`);
      this.showSnackBar(this.i18n({value: 'Saved', id: '@@saved'}));
    });
  }

  deleteHero(id: string): Promise<void> {
    return this.afs.doc(EndpointsConfig.orders.detail(id)).delete();
  }

  showSnackBar(name): void {
    const config: any = new MatSnackBarConfig();
    config.duration = AppConfig.snackBarDuration;
    this.snackBar.open(name, 'OK', config);
  }
}
