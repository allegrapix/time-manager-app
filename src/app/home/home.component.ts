import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LoginOrRegisterService } from '../services/login-or-resgister.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  notLogged = true;
  imgSrc = '../../assets/img/banner_light.jpg';
  bannerText = 'No time to loose';
  welcomeText = ['Quick to learn', 'Easy to use', 'Manage your tasks', 'Save your time'];
  constructor(
    private router: Router,
    private logOrRegServ: LoginOrRegisterService,
    private authServ: AuthService
    ) { }

  ngOnInit() {
    this.userSub = this.authServ.user.subscribe(user => {
      this.notLogged = user ? false : true;
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  goToLogin() {
    this.logOrRegServ.goToRegister.emit(false);
    this.router.navigate(['/login']);
  }
}
