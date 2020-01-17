import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile-link',
  templateUrl: './profile-link.component.html',
  styleUrls: ['./profile-link.component.scss']
})
export class ProfileLinkComponent implements OnInit, OnDestroy {
  profileImg: SafeUrl;
  userSub: Subscription;

  constructor(
    private authService: AuthService,
    private domSanitizer: DomSanitizer,
    private userService: UserService
    ) { }

  ngOnInit() {
    this.userSub = this.userService.getUser().subscribe(user => {
      this.profileImg  = this.domSanitizer.bypassSecurityTrustUrl(`data:image/jpg;base64, ${user.avatar}`);
      
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
