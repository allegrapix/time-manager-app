import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { User } from 'src/app/profile/user.model';
import { Task } from 'src/app/my-tasks/task/task.model';
import { TasksService } from 'src/app/services/tasks.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
  tasks: Task[];
  noTasks = true;
  base64Image: SafeUrl;

  constructor(
    private taskService: TasksService,
    private userService: UserService,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {   
    this.getUserTasks();
    this.getUserAvatar();
  }

  getUserTasks() {
    this.tasksSub = this.taskService.getUserTasks(this.user._id).subscribe(tasks => {
      this.tasks = tasks;
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

  ngOnDestroy() {
    this.tasksSub.unsubscribe();
  }
}
