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
  limit = 8;
  searchMsg = '';
  usersFound = false;
  nrUsers: number;
  lastPage = false;
  nrOfPages: number;
  searchMode = false;
  searchItem = '';

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
      this.searchMode = true;
      this.searchItem = searchedUser;
      if (searchedUser.length > 0) {
        this.searchUsers(this.searchItem);
      } else {
        this.getUsers();
      }
    });
  }

  searchUsers(searchTerm) {
    this.userService.searchUserByAdmin(searchTerm, this.limit, this.skip).subscribe(users => {
      this.users = users.users;
      this.searchMsg = this.users.length === 0 ? searchTerm : '';
      this.nrUsers = users.count; 
      this.getNrOfPages(users.noOfPages);
      this.usersFound = true;     
    });
  }

  getUsers() {
    this.getUsersOnPageSub = this.userService.getUsers(this.limit, this.skip).subscribe(users => {      
      this.users = users.users;
      this.nrUsers = users.count; 
      this.getNrOfPages(users.noOfPages);
    })
  }

  getNrOfPages(noOfPages) {
    this.nrOfPages = noOfPages;
    this.lastPage =  Math.ceil(this.skip / this.limit) === this.nrOfPages - 1 ? true : false;
  }

  resetSearch() {
    this.skip = 0;
    this.usersFound = false;
    this.searchMode = false;
    this.searchMsg = '';
    this.searchItem = '';
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
    this.searchMode ? this.searchUsers(this.searchItem) : this.getUsers();
  }

  ngOnDestroy() {
    this.userSearchSub.unsubscribe();
    this.getUsersOnPageSub.unsubscribe();
  }
}
