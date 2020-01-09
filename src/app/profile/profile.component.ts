import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  dropDownIsOpen = false;
  selectedFile: File = null;
  avatarForm: FormGroup;

  constructor(private userService: UserService) { }

  ngOnInit() {

  }

  rotateArrow() {
    this.dropDownIsOpen = !this.dropDownIsOpen;
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0]; 
    this.onSubmit();
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('avatar', this.selectedFile, this.selectedFile.name);
    this.userService
      .postAvatar(formData)
      .subscribe(resData => {
        console.log(resData);
      });
  }
}
