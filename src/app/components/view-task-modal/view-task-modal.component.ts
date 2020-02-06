import { Component, OnInit, Input } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { Task } from 'src/app/my-tasks/task/task.model';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-view-task-modal',
  templateUrl: './view-task-modal.component.html',
  styleUrls: ['./view-task-modal.component.scss'],
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
export class ViewTaskModalComponent implements OnInit {
  @Input() userID;
  @Input() taskID;
  color: string;
  task: Task = {
    _id: null,
    title: '',
    status: '',
    workedHours: 0,
    description: ''
  };

  constructor(
    private taskService: TasksService
  ) { }

  ngOnInit() {
    this.taskService.getUserTask(this.userID, this.taskID).subscribe(task => {
      this.task = task;
      this.color = this.taskService.getColor(this.task.status);
    });
  }

  getColor() {
    return this.color;
  }

  closeView() {
    this.taskService.closeViewTaskByAdmin.emit(true);
  }
}
