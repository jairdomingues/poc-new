import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hero } from 'src/app/modules/heroes/shared/hero.model';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json', 'X-TENANT': 'public'})
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  env = environment;
  apiUrl = this.env.SERVER_URL + 'orders';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error[0].message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`); 
    }
    // return an observable with a user-facing error message
    return throwError(error.error[0].mensagem);
  }

  order: any = {};
  salesOrganization: any = {};

  sendOrder(hero: Hero): Observable<any> {

    this.order.salesOrder = hero.order;
    this.order.salesOrderStatus = "COMPLETED";;
    this.order.distributionChannel = "SE";;
    this.order.organizationDivision = "CE";;
    this.order.soldToParty = "479";;
    this.order.customerNumber= "479";
    this.order.id = hero.id;
    this.salesOrganization.id = 1;
    this.order.salesOrganization = this.salesOrganization;

    return this.http.post<any>(this.apiUrl, this.order, httpOptions).pipe(
      tap((hero: any) => console.log(`login bem sucedido username=${hero}`)),
      catchError(this.handleError)
    );
  } 

}
