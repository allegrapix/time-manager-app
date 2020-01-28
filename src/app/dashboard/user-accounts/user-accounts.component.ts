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
  userDeleteSub : Subscription;

  constructor(
    private userService: UserService
    ) { }

  ngOnInit() {
    this.getAllUsers();
    this.userDeleteSub = this.userService.userDeleted.subscribe(user_id => {
      const index = this.users.findIndex(user => user._id === user_id);
      this.users.splice(index, 1);
    })
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
