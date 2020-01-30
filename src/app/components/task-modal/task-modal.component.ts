import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { TasksService } from 'src/app/services/tasks.service';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
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
export class TaskModalComponent implements OnInit, OnDestroy {
  @Input() userID: string;
  modalForm: FormGroup;
  submitBtn = 'Submit';
  statuses = [];
  task: Task = {
    _id: null,
    title: '',
    status: '',
    workedHours: 0,
    description: ''
  }
  defaultStatus = 'todo';
  dropDownIsOpen = false;
  constructor(
    private taskService: TasksService,
    private userService: UserService
    ) { }

  ngOnInit() {
    this.statuses = this.taskService.getStatuses();
    this.modalForm = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'status': new FormControl(null, Validators.required),
      'workedHours': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required)
    });
  }

  onCloseTask() {
    this.taskService.closeTaskModal.emit(null);
  }

  onSubmit() {
    this.taskService.postTaskByAdmin(this.userID, this.modalForm.value).subscribe(task => {   
      this.taskService.closeTaskModal.emit(task);
    });
  }

  rotateArrow() {
    this.dropDownIsOpen = !this.dropDownIsOpen;
  }
  
  ngOnDestroy() {
  }
}
