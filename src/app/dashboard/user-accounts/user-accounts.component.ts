import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/profile/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-accounts',
  templateUrl: './user-accounts.component.html',
  styleUrls: ['./user-accounts.component.scss']
})
export class UserAccountsComponent implements OnInit, OnDestroy {
  getAllUsersSub: Subscription;
  winHeight: number = window.innerHeight;
  users: User[] = [];

  constructor(
    private userService: UserService
    ) { }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.getAllUsersSub = this.userService.getUsers().subscribe(users => {
      this.users = users; 
    });
  }

  ngOnDestroy() {
    this.getAllUsersSub.unsubscribe();
  }
}
