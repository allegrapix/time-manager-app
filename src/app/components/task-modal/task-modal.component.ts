import { Component, OnInit, Input } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Task } from 'src/app/my-tasks/task/task.model';

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
export class TaskModalComponent implements OnInit {
  @Input() userID: string;
  @Input() taskID: string;
  modalForm: FormGroup;
  submitBtn = 'Submit';
  statuses = [];
  task: Task = {
    _id: null,
    title: '',
    status: '',
    workedHours: 0,
    description: ''
  };
  defaultStatus = 'todo';
  dropDownIsOpen = false;
  startedAt = new FormControl(new Date());
  constructor(
    private taskService: TasksService
    ) { }

  ngOnInit() {
    this.statuses = this.taskService.getStatuses();
    this.modalForm = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'status': new FormControl(null, Validators.required),
      'startedAt': this.startedAt,
      'workedHours': new FormControl(0, [Validators.required, Validators.min(0), Validators.max(10)]),
      'description': new FormControl(null, Validators.required)
    });
    if (this.taskID) {
      this.taskService.getUserTask(this.userID, this.taskID).subscribe(task => {
        this.modalForm.setValue({
          'title': task.title,
          'status': task.status,
          'startedAt': task.startedAt,
          'workedHours': task.workedHours,
          'description': task.description
        });
      });
    }
  }

  onCloseTask() {
    this.taskService.closeTaskModal.emit(null);
  }

  onSubmit() {
    if (!this.taskID) {
      this.taskService.postTaskByAdmin(this.userID, this.modalForm.value).subscribe(task => {
        this.taskService.closeTaskModal.emit(task);
      });
    } else {
      this.taskService.editTaskByAdmin(this.userID, this.taskID, this.modalForm.value).subscribe(task => {
        this.taskService.closeTaskModal.emit(task);
      });
    }
  }

  rotateArrow() {
    this.dropDownIsOpen = !this.dropDownIsOpen;
  }
}
