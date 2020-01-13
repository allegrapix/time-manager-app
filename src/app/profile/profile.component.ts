import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { throwError, Observable, Observer } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

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
  loadingBar = 0;
  isLoading = false;
  @ViewChild('dropdownStatusForm', {static: true}) dropdownStatusForm: NgForm;
  @ViewChild('listItem', {static: true}) listItem: ElementRef;
  dropdownStatusIsOpen = false;
  listHeight;
  options = [
    { name: 'all', value: 'all' },
    { name: 'ongoing', value: 'ongoing' },
    { name: 'completed', value: 'completed' },
    { name: 'to do', value: 'todo' }
  ];
  
  constructor(
    private userService: UserService,
    private domSanitizer: DomSanitizer,
    private router: Router
    ) { }

  ngOnInit() {
    this.getUserAvatar();
    this.listHeight = (this.listItem.nativeElement.offsetHeight + 15) * 3;
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
      if (event.type === HttpEventType.UploadProgress) {
        this.isLoading = true;
        this.loadingBar = Math.round(event.loaded / event.total * 100);
      } else if (event.type === HttpEventType.Response) {
        setTimeout(() => {
          this.isLoading = false;
          this.getUserAvatar();
        }, 500);
      }
    });
  }

  goToEditProfile() {
    this.router.navigate(['edit-profile']);
  }

  deleteProfile() {
    this.userService.deleteUser().subscribe(resData => {
      localStorage.removeItem('userData');
      this.router.navigate(['login']);      
    });
  }
}
