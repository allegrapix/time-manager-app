import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { TasksService } from 'src/app/services/tasks.service';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
  animations: [
    trigger('showTaskModalBgr', [
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
    ]),
    trigger('showTaskModal', [
      state('fadeIn',
        style({
          opacity: 1,
          height: 'auto'
        })
      ),
      transition('void => *', [
        style({
          opacity: 0,
          height: 0
        }),
        animate(100)
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
export class TaskModalComponent implements OnInit, OnDestroy {
  @Input() userID: string;
  constructor(
    private taskService: TasksService,
    private userService: UserService
    ) { }

  ngOnInit() {
    console.log(this.userID);  

  }

  onCloseTask() {
    this.taskService.closeTaskModal.emit();
  }
  
  ngOnDestroy() {
  }
}
