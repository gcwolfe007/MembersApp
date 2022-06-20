import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMember, IResults } from './Member';
import { MembersService } from './members.service';

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.css']
})
export class MemberProfileComponent implements OnInit {
  pageTitle = 'Member Profile';
  member!: IMember;
  email!: string;
  members!: IMember[];
  results!: IResults;
  errorMessage!: string;

  constructor(private membersService: MembersService, private route: ActivatedRoute) {
    console.log(this.route.snapshot.paramMap.get('email'));
   }

  ngOnInit(): void {

    this.email = this.route.snapshot.paramMap.get('email');
    console.log('value is ' + this.email);

    this.membersService.data$.subscribe(
      (result: IResults) => {
        this.results = result;
        this.members = this.results.results;
        this.member = this.members.find( m => m.email === this.email);
        console.log(this.member);
      },
      (error: any) => (this.errorMessage = (error as any))
    );

  }

}
