import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IMember } from './Member';

/* NgRx */
import { Store } from '@ngrx/store';
import { getMembers, getCurrentMember, getError, State } from './state';


@Component({
  selector: 'app-members-shell',
  templateUrl: './members-shell.component.html',
})
export class MembersShellComponent implements OnInit {
  selectedMember$!: Observable<IMember>;
  errorMessage$!: Observable<string>;
  members$!: Observable<IMember[]>;
  constructor(private store: Store<State>) {}

  ngOnInit(): void {

    // Do NOT subscribe here because it uses an async pipe
    this.members$ = this.store.select(getMembers);

    // Do NOT subscribe here because it uses an async pipe
    this.errorMessage$ = this.store.select(getError);

  //  this.selectedMember$ = this.store.select(getCurrentMember);

  }
}
