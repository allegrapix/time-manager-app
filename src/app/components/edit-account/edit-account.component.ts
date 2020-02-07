import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/profile/user.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss'],
  animations: [
    trigger('showEditModal', [
      state('fadeIn',
        style({
          opacity: 1
        })
      ),
      transition('void => *', [
        style({
          opacity: 0
        }),
        animate(200)
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
export class EditAccountComponent implements OnInit {
  selectedUser: User;
  noAvatar = true;
  editModalIsOpen = false;
  userEditSub: Subscription;
  editUserAdminForm: FormGroup;
  selectedFile: File = null;
  dropDownIsOpen = false;
  hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  base64Image: SafeUrl;
  locStorage;

  constructor(
    private userService: UserService,
    private domSanitizer: DomSanitizer,
    private auth: AuthService
    ) { }

  ngOnInit() {
    this.locStorage = JSON.parse(localStorage.getItem('userData'));
    this.userEditSub = this.userService.userToBeEdited.subscribe(user => {
      if (user) {
        this.selectedUser = user;
        this.editModalIsOpen = true;
        this.editUserAdminForm = new FormGroup({
          'name': new FormControl(user.name, Validators.required),
          'email': new FormControl(user.email, [Validators.required, Validators.email]),
          'preferredWorkingHours': new FormControl(user.preferredWorkingHours, Validators.required)
        });
      }
      if (user.avatar) {
        this.base64Image = this.domSanitizer.bypassSecurityTrustUrl(`data:image/jpg;base64, ${user.avatar}`);
        this.noAvatar = false;
      } else {
        this.noAvatar = true;
      }
    });
  }

  closeEditModal() {
    this.editModalIsOpen = false;
  }

  adminEditUser() {
    this.userService.editUserByAdmin(this.selectedUser._id, this.editUserAdminForm.value)
    .subscribe(resData => {
      const updates = Object.keys(resData);
      updates.forEach(update => {
        this.selectedUser[update] = resData[update];
        if (this.selectedUser._id === this.locStorage._id) {
          this.locStorage[update] = resData[update];
          localStorage.setItem('userData', JSON.stringify(this.locStorage));
          this.auth.autoLogin();
        }
      });
      this.editModalIsOpen = false;
    });
  }

  onAvatarSelected(event) {
    this.selectedFile = <File> event.target.files[0];
    this.onSubmitAvatar();
  }

  onSubmitAvatar() {
    const formData = new FormData();
    formData.append('avatar', this.selectedFile, this.selectedFile.name);
    this.userService.postAvatarByAdmin(formData, this.selectedUser._id).subscribe(resData => {
      this.getUserAvatar();
    });
  }

  getUserAvatar() {
    this.userService.getUserByAdmin(this.selectedUser._id).subscribe(resData => {
      this.selectedUser.avatar = resData.avatar;
      this.base64Image = this.domSanitizer.bypassSecurityTrustUrl(`data:image/jpg;base64, ${resData.avatar}`);
      this.userService.avatarChanged.emit(this.selectedUser);
    });
  }

  rotateArrow() {
    this.dropDownIsOpen = !this.dropDownIsOpen;
  }
}
