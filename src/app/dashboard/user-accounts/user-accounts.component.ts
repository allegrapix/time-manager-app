import { Component, OnInit, OnDestroy, Input } from '@angular/core';
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
  getUsersOnPageSub: Subscription;
  winHeight: number = window.innerHeight;
  users: User[] = [];
  usersAll: User[] = [];  
  userDeleteSub: Subscription;
  userSearchSub: Subscription;
  searchedWord = '';
  skip = 0;
  limit = 5;
  noUsersFound = false;
  searchMsg;
  usersFound = false;

  constructor(
    private userService: UserService
    ) { }

  ngOnInit() {
    this.getUsers();
    this.userDeleteSub = this.userService.userDeleted.subscribe(user_id => {
      const index = this.users.findIndex(user => user._id === user_id);
      this.users.splice(index, 1);
    });
    this.userSearchSub = this.userService.searchUser.subscribe(searchedUser => {
      if (searchedUser.length > 0) {
        this.userService.getUsers(undefined, undefined).subscribe(users => {
          this.usersAll = users; 
          this.users = this.usersAll.filter(user => user.name.includes(searchedUser) || user.email.includes(searchedUser));        
          this.noUsersFound = this.users.length === 0 ? true : false;
          this.searchMsg = searchedUser;
          this.usersFound = true;
        });
      } else {
        this.getUsers();
      }
    })
  }

  getUsers() {
    this.getUsersOnPageSub = this.userService.getUsers(this.limit, this.skip).subscribe(users => {
      this.users = users;
      this.noUsersFound = false;
      this.usersFound = false;
    })
  }

  resetSearch() {
    this.getUsers();
  }

  ngOnDestroy() {
    this.userSearchSub.unsubscribe();
    this.getUsersOnPageSub.unsubscribe();
  }
}
