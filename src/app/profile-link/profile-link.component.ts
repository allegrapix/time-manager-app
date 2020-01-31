import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../services/user.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-profile-link',
  templateUrl: './profile-link.component.html',
  styleUrls: ['./profile-link.component.scss'],
  animations: [
    trigger('showProfileLink', [
      transition('void => *', [
        style({
          opacity: 0,
          height: 0
        }),
        animate(300)
      ]),
      transition('* => void', [
        animate(200, 
          style({
            opacity: 0,
            height: 0
          })
        )
      ])
    ])
  ]
})
export class ProfileLinkComponent implements OnInit, OnDestroy {
  profileImg: SafeUrl;
  userSub: Subscription;
  noAvatar = true;
  username = '';

  constructor(
    private domSanitizer: DomSanitizer,
    private userService: UserService
    ) { }

  ngOnInit() {
    this.userSub = this.userService.getUser().subscribe(user => {
      this.username = user.name
      if (user.avatar) {
        this.profileImg  = this.domSanitizer.bypassSecurityTrustUrl(`data:image/jpg;base64, ${user.avatar}`); 
        this.noAvatar = false;
      } else {
        this.noAvatar = true;
      }
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
