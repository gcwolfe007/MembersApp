import { Injectable } from '@angular/core';

import { mergeMap, map, catchError, concatMap } from 'rxjs/operators';
import {  of } from 'rxjs';
import { MembersService } from '../members.service';

/* NgRx */
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MemberApiActions, MemberPageActions } from './actions';


@Injectable()
export class MemberEffects {
  constructor(private actions$: Actions, private membersService: MembersService) {}

  loadMembers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MemberPageActions.loadMembers),
      mergeMap(() =>
        this.membersService.getMembers().pipe(
          map((results) => MemberApiActions.LoadMembersSuccess({ results })),
          catchError((error) => of(MemberApiActions.loadMembersFailure({ error })))
        )
      )
    );
  });
}
