import { Component, OnInit, OnDestroy, ComponentFactoryResolver, ViewChild, Output, EventEmitter } from '@angular/core';
import { LoginOrRegisterService } from '../services/login-or-resgister.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../components/alert/alert.component';
import { PlaceHolderDirective } from '../services/placeholder.directive';
import { TaskModalComponent } from '../components/task-modal/task-modal.component';
import { TasksService } from '../services/tasks.service';
import { UserService } from '../services/user.service';

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
  @ViewChild(PlaceHolderDirective, {static: false}) newTaskHost: PlaceHolderDirective;
  private closeAlertSub: Subscription;
  private taskModalSub: Subscription;
  private closeTaskSub: Subscription;
  allowed = false;

  constructor(
    private logOrRegServ: LoginOrRegisterService,
    private authService: AuthService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private taskService: TasksService,
    private userService: UserService
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
    this.taskModalSub = this.taskService.taskModal.subscribe(foundUserID => {
      if(foundUserID) {
        this.showNewTask(foundUserID);
      }
    });
  }

  showNewTask(userID) {
    const compFactory = this.componentFactoryResolver.resolveComponentFactory(TaskModalComponent);
    const hostViewContainerRef = this.newTaskHost.viewContainerRef;
    hostViewContainerRef.clear();
    const newTaskCompRef = hostViewContainerRef.createComponent(compFactory);  
    newTaskCompRef.instance.userID = userID;  
    this.closeTaskSub = this.taskService.closeTaskModal.subscribe(() => {
      this.closeTaskSub.unsubscribe();
      hostViewContainerRef.clear();
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
    if (this.closeTaskSub) {
      this.closeTaskSub.unsubscribe();
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
