import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { User } from 'src/app/profile/user.model';
import { Task } from 'src/app/my-tasks/task/task.model';
import { TasksService } from 'src/app/services/tasks.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  animations: [
    trigger('showUserCard', [
      state('fadeIn',
        style({
          transform: 'tranlateY(0)',
          opacity: 1
        })
      ),
      transition('void => *', [
        style({
          transform: 'translateY(-100px)',
          opacity: 0
        }),
        animate(200)
      ]),
      transition('* => void', [
        animate(200,
          style({
            transform: 'translateY(100px)',
            opacity: 0
          })
        )
      ])
    ]),
    trigger('openCloseCard', [
      state('closed',
        style({
          height: '70px'
        })
      ),
      state('open',
        style({
          height: '400px'
        })
      ),
      transition('open <=> close', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class AccountComponent implements OnInit, OnDestroy {
  @Input() user: User;
  showProfile = false;
  tasksSub: Subscription;
  tasks: Task[] = [];
  noTasks = true;
  base64Image: SafeUrl;
  avatarChangeSub: Subscription;
  today = new FormControl(new Date());
  @Output() newUserSelected: EventEmitter<User> = new EventEmitter<User>();
  newTaskAdded: Subscription;
  taskDeletedSub: Subscription;

  constructor(
    private taskService: TasksService,
    private userService: UserService,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit() { 
    this.getUserTasks(this.today.value);
    this.getUserAvatar();
    this.avatarChangeSub = this.userService.avatarChanged.subscribe(userData => {
      if (this.user._id === userData._id) {
        this.user = userData;
        this.getUserAvatar()
      }
    });
    this.newTaskAdded = this.taskService.closeTaskModal.subscribe(task => {
      if(task) {
        this.getUserTasks(this.today.value);
      }
    });
    this.taskDeletedSub = this.taskService.deleteTaskConfirmedByAdmin.subscribe(confirmed => {
      console.log(confirmed);
      
      if(confirmed) {
        this.getUserTasks(this.today.value);
      }
    });
  }

  getUserTasks(selDate: Date) {
    const selDay = selDate.getDate();
    const selMonth = selDate.getMonth();    
    this.tasksSub = this.taskService.getUserTasks(this.user._id).subscribe(tasks => {
      this.tasks = [];
      tasks.filter((task: Task) => {
        const dd = new Date(task.updatedAt).getDate();
        const mm = new Date(task.updatedAt).getMonth();
        if (selDay === dd && selMonth === mm) {
          this.tasks.push(task);
        }  
      })
      this.noTasks = this.tasks.length > 0 ? false : true;
    });
  }

  getUserAvatar() {
    if(this.user.avatar) {
      this.base64Image = this.domSanitizer.bypassSecurityTrustUrl(`data:image/jpg;base64, ${this.user.avatar}`);
    } else {
      this.base64Image = '../../../../assets/img/robot.png';
    }
  }

  editSelectedUser() {
    this.userService.userToBeEdited.emit(this.user);
  }

  showHiddenProfile() {
    this.showProfile = !this.showProfile;
  }

  deleteSelectedUser() {
    this.userService.deleteUserByAdmin(this.user._id).subscribe(resData => {
      this.userService.userDeleted.emit(resData._id);
    })
  }

  getTodaysTasks(event: MatDatepickerInputEvent<Date>) {
    this.getUserTasks(event.value);    
  }

  openTaskModal() {
    this.taskService.taskModal.emit({
      userID: this.user._id,
      taskID: null
    });
  }

  ngOnDestroy() {
    this.tasksSub.unsubscribe();
    this.avatarChangeSub.unsubscribe();
    this.newTaskAdded.unsubscribe();
    this.taskDeletedSub.unsubscribe();
  }
}
