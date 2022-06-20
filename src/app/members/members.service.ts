import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';

import { IMember, IResults } from './Member';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, map, flatMap, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { analyzeFile } from '@angular/compiler';
import { SharedReplayRefresh } from './sharedReplayRefresh';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private membersUrl = environment.membersUrl;
  private members: IMember[] | undefined;
  private results: IResults | undefined;
  private dataSource = new SharedReplayRefresh();
  private source = this.http.get<IResults>(this.membersUrl);
  constructor(private http: HttpClient) {}

  getMembers(): Observable<IResults> {

    return this.http.get<IResults>(this.membersUrl)
    .pipe(
       // tap((data) => console.log(JSON.stringify(data))),
      tap((data) => (this.results = data)),
      // tap((data) => (this.members = data)),
      catchError(this.handleError)
    );
  }

  get data$(): Observable<IResults> {
    return this.dataSource .sharedReplayTimerRefresh(this.source, 1, 1500);
}

 // tslint:disable-next-line: typedef
 private handleError(err: any) {
  // in a real world app, we may send the server to some remote logging infrastructure
// instead of just logging it to the console
let errorMessage: string;
if (err.error instanceof ErrorEvent) {
 // A client-side or network error occurred. Handle it accordingly.
 errorMessage = `An error occurred: ${err.error.message}`;
} else {
 // The backend returned an unsuccessful response code.
 // The response body may contain clues as to what went wrong,
 errorMessage = `Backend returned code ${err.status}: ${err.message}`;
}
console.error(err);
return throwError(errorMessage);
}

}
