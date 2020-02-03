import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/profile/user.model';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-user-accounts',
  templateUrl: './user-accounts.component.html',
  styleUrls: ['./user-accounts.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition('void => *', [
        style({
          opacity: 0
        }),
        animate(300)
      ]),
      transition('* => void', [
        animate(200, 
          style({
            opacity: 0
          })
        )
      ])
    ])
  ]
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
  limit = 9;
  noUsersFound = false;
  searchMsg;
  usersFound = false;
  nSub: Subscription;
  nrUsers: number;
  lastPage = false;
  nrOfPages: number;

  constructor(
    private userService: UserService
    ) { }

  ngOnInit() {
    this.nSub = this.userService.getNoOfUsers().subscribe(user => {
      this.nrUsers = user.numbers; 
      this.nrOfPages = Math.ceil(this.nrUsers / this.limit);
      console.log(this.skip);
      
      this.lastPage =  Math.ceil(this.skip / this.limit) === this.nrOfPages ? true : false;
    });
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
    });
  }

  getUsers() {
    this.getUsersOnPageSub = this.userService.getUsers(this.limit, this.skip).subscribe(users => {
      this.users = users;
      this.noUsersFound = false;
      this.usersFound = false;
    })
  }

  resetSearch() {
    this.skip = 0;
    this.checkPages();
  }

  showPrev() {
    if(this.skip >= this.limit) {
      this.skip -= this.limit;      
      this.checkPages();
    }
  }

  showNext() {
    this.skip += this.limit;
    this.checkPages();
  }

  checkPages() {
    this.getUsers();
    this.lastPage =  Math.ceil(this.skip / this.limit) + 1 === this.nrOfPages ? true : false;
  }

  ngOnDestroy() {
    this.userSearchSub.unsubscribe();
    this.getUsersOnPageSub.unsubscribe();
  }
}
