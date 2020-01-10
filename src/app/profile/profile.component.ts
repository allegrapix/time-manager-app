import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { throwError, Observable, Observer } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
  base64Image: SafeUrl;
  noAvatar = true;


  constructor(
    private userService: UserService,
    private domSanitizer: DomSanitizer
    ) { }

  ngOnInit() {
    this.getUserAvatar();
  }

  rotateArrow() {
    this.dropDownIsOpen = !this.dropDownIsOpen;
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0]; 
    this.onSubmit();
  }

  getUserAvatar() {
    this.userService.getUser().subscribe(user => {
      if (user.avatar) {
        this.noAvatar = false;
        this.base64Image  = this.domSanitizer.bypassSecurityTrustUrl(`data:image/jpg;base64, ${user.avatar}`);
      } else {
        this.noAvatar = true
      }
    });
  }


  onSubmit() {
    const formData = new FormData();
    formData.append('avatar', this.selectedFile, this.selectedFile.name);
    this.userService
    .postAvatar(formData)
    .subscribe(event => {
      console.log(event);
      if (event.type === HttpEventType.UploadProgress) {
        console.log('Upload progress: ', Math.round(event.loaded / event.total * 100) + '%');
      } else if (event.type === HttpEventType.Response) {
        console.log(event);
        this.getUserAvatar();
      }
    });
  }
}
