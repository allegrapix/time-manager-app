import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Task } from 'src/app/my-tasks/task/task.model';
import { TasksService } from 'src/app/services/tasks.service';
import { User } from 'src/app/profile/user.model';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-task',
  templateUrl: './dashboard-task.component.html',
  animations: [
    trigger('showUserTask', [
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
        animate(300)
      ]),
      transition('* => void', [
        animate(300,
          style({
            transform: 'translateY(100px)',
            opacity: 0
          })
        )
      ])
    ]),
  ]
})
export class DashboardTaskComponent implements OnInit {
  @Input() task: Task;
  @Input() user: User;
  constructor(
    private tasksService: TasksService
    ) { }

  ngOnInit() {
  }

  getColor(status: string) {
    const color = this.tasksService.getColor(status);
    return color;
  }

  editSelectedTask() {
    this.tasksService.taskModal.emit({
      userID: this.user._id,
      taskID: this.task._id
    });
  }

  onDeleteSelectedTask() {
    this.tasksService.confirmDeleteAlert.emit({
      userID: this.user._id,
      taskID: this.task._id
    });
  }
}
