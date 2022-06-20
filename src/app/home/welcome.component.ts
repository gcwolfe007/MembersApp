import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent implements OnInit {
  public pageTitle = 'Welcome to  the Members Site';
  constructor() { }

  ngOnInit(): void {
  }

}
