import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { AppComponent } from './app.component';
import { ShellComponent } from './home/shell.component';
import { WelcomeComponent } from './home/welcome.component';
import { MemberListComponent } from './members/member-list.component';
import { MemberProfileComponent } from './members/member-profile.component';

const routes: Routes = [
  {path: '',
  component: ShellComponent,
  children: [
    {path: 'welcome', component: WelcomeComponent  },
    {path: 'members', component: MemberListComponent},
    {path: 'memberprofile/:email', component: MemberProfileComponent},
    {path: '', redirectTo: 'welcome', pathMatch: 'full' },
  ]
},
  {path: '**', component: WelcomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
