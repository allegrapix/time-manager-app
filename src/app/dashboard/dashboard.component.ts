import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  searchUserForm: FormGroup;
  searchedWord: '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
    ) { }

  ngOnInit() {
    this.router.navigate(['accounts'], {relativeTo: this.route});
    this.searchUserForm = new FormGroup({
      'search': new FormControl(null)
    })
  }

  goToAccounts() {
    this.router.navigate(['accounts'], {relativeTo: this.route});
  }

  goToTasks() {
    this.router.navigate(['task-manager'], {relativeTo: this.route});
  }

  onSeachUser(event) {
    this.searchedWord = event.srcElement.value;
    this.userService.searchUser.emit(this.searchedWord.toLowerCase());
    this.searchUserForm.reset();
  }
}
