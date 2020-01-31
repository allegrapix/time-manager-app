import { Component, OnInit, OnDestroy, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { LoginOrRegisterService } from '../services/login-or-resgister.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../components/alert/alert.component';
import { PlaceHolderDirective } from '../services/placeholder.directive';
import { TaskModalComponent } from '../components/task-modal/task-modal.component';
import { TasksService } from '../services/tasks.service';
import { ConfirmComponent } from '../components/confirm/confirm.component';
import { userInfo } from 'os';
import { ViewTaskModalComponent } from '../components/view-task-modal/view-task-modal.component';

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
  @ViewChild(PlaceHolderDirective, {static: false}) confirmAlertHost: PlaceHolderDirective;
  @ViewChild(PlaceHolderDirective, {static: false}) viewTaskHost: PlaceHolderDirective;
  private closeAlertSub: Subscription;
  taskModalSub: Subscription;
  private closeTaskSub: Subscription;
  allowed = false;
  private closeConfirmSub: Subscription;
  confirmDeleteSub: Subscription;
  viewTaskSub: Subscription;
  closeViewTaskSub: Subscription;

  constructor(
    private logOrRegServ: LoginOrRegisterService,
    private authService: AuthService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private taskService: TasksService
    ) {
    this.logOrRegServ.goToRegister.subscribe((isTrue: boolean) => {this.register = isTrue;})
  }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.notLogged = !user;
    });
    this.authService.pageNotAllowed.subscribe(() => {
      this.showAlert();
    });
    this.taskModalSub = this.taskService.taskModal.subscribe(foundUser => {     
      if(foundUser.userID) {
        this.showNewTask(foundUser);
      }
    });
    this.confirmDeleteSub = this.taskService.confirmDeleteAlert.subscribe(userInfo => {
      this.confirmAlert(userInfo);
    });
    this.viewTaskSub = this.taskService.viewTaskByAdmin.subscribe(userInfo => {
      this.viewTaskModal(userInfo);
    })
  }

  showNewTask(userInfo) {
    const compFactory = this.componentFactoryResolver.resolveComponentFactory(TaskModalComponent);
    const hostViewContainerRef = this.newTaskHost.viewContainerRef;
    hostViewContainerRef.clear();
    const newTaskCompRef = hostViewContainerRef.createComponent(compFactory);  
    newTaskCompRef.instance.userID = userInfo.userID;
    newTaskCompRef.instance.taskID = userInfo.taskID;
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
    if (this.closeConfirmSub) {
      this.closeConfirmSub.unsubscribe();
    }
    if (this.closeViewTaskSub) {
      this.closeViewTaskSub.unsubscribe();
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

  confirmAlert(userInfo) {
    const compFactory = this.componentFactoryResolver.resolveComponentFactory(ConfirmComponent);
    const hostViewContainerRef = this.confirmAlertHost.viewContainerRef;
    hostViewContainerRef.clear();    
    const confirmCompRef = hostViewContainerRef.createComponent(compFactory);
    confirmCompRef.instance.userID = userInfo.userID;
    confirmCompRef.instance.taskID = userInfo.taskID;
    this.closeConfirmSub = this.taskService.deleteTaskConfirmedByAdmin.subscribe(() => {
      this.closeConfirmSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  viewTaskModal(userInfo) {
    const compFactory = this.componentFactoryResolver.resolveComponentFactory(ViewTaskModalComponent);
    const hostViewContainerRef = this.viewTaskHost.viewContainerRef;
    hostViewContainerRef.clear();
    const viewTaskCompRef = hostViewContainerRef.createComponent(compFactory);
    viewTaskCompRef.instance.userID = userInfo.userID;
    viewTaskCompRef.instance.taskID = userInfo.taskID;
    this.closeViewTaskSub = this.taskService.closeViewTaskByAdmin.subscribe(close => {
      this.closeViewTaskSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}
