import { Component, OnInit, OnDestroy, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { LoginOrRegisterService } from '../services/login-or-resgister.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../components/alert/alert.component';
import { PlaceHolderDirective } from '../services/placeholder.directive';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  menuIsOpen = false;
  register = false;
  notLogged = true;
  error = 'You do not have permission to access this page';
  alertModal = false;
  @ViewChild(PlaceHolderDirective, {static: false}) alertHost: PlaceHolderDirective;
  private closeAlertSub: Subscription;
  allowed = false;

  constructor(
    private logOrRegServ: LoginOrRegisterService,
    private authService: AuthService,
    private componentFactoryResolver: ComponentFactoryResolver
    ) {
    this.logOrRegServ.goToRegister.subscribe((isTrue: boolean) => {this.register = isTrue;})
  }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.notLogged = !user;
    });
    this.authService.pageNotAllowed.subscribe(() => {
      this.showAlert();
    })
  }

  onHandleClose() {
    this.alertModal = false;
  }

  onGoToHome() {
    this.menuIsOpen = false;
  }

  onMenuOpen() {
    this.menuIsOpen = !this.menuIsOpen;
    this.menuIsOpen === true ? document.body.classList.add('positionFixed') : document.body.classList.remove('positionFixed');
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    if (this.closeAlertSub) {
      this.closeAlertSub.unsubscribe();
    }
  }

  onLogout() {
    this.authService.logout();
  }

  showAlert() {
    const compFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();    
    const alertCompRef = hostViewContainerRef.createComponent(compFactory);
    alertCompRef.instance.message = this.error;
    this.closeAlertSub = alertCompRef.instance.closeAlert.subscribe(() => {
      this.closeAlertSub.unsubscribe();
      hostViewContainerRef.clear();
    });
    setTimeout(() => {
      this.closeAlertSub.unsubscribe();
      hostViewContainerRef.clear();
    }, 5000);
  }
}
