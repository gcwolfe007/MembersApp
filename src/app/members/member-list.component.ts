import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IMember, IResults } from './Member';

import { getMembers, getCurrentMember, getError, State } from './state';
import { Observable } from 'rxjs';
import { MembersService } from './members.service';
@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  pageTitle = 'Members List';
  @Input() errorMessage!: string;
  members!: IMember[];
  results!: IResults;
  query!: string;


  constructor(private membersService: MembersService, private router: Router) {}
  ngOnInit(): void {
    // Do NOT subscribe here because it uses an async pipe
    // this.members$ = this.store.select(getMembers);

    this.membersService.data$.subscribe(
      (result: IResults) => {
        this.results = result;
        this.members = this.results.results;
      },
      (error: any) => (this.errorMessage = (error as any))
    );

    //  this.selectedMember$ = this.store.select(getCurrentMember);
  }
  fetchProfile(email: string): void {
    console.log(email);
    this.router.navigateByUrl('/memberprofile/' + email);
}
}
