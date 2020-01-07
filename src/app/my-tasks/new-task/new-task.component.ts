import { Component, OnInit } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {
  statuses = [];
  defaultStatus = 'todo';
  dropDownIsOpen = false;
  newTaskForm: FormGroup;

  constructor(private tasksService: TasksService,
    private http: HttpClient
    ) { }

  ngOnInit() {
    this.statuses = this.tasksService.getStatuses();
    this.newTaskForm = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'status': new FormControl(null, Validators.required),
      'workedHours': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required)
    });
  }

  rotateArrow() {
    this.dropDownIsOpen = !this.dropDownIsOpen;
  }

  onSubmit() {
    console.log(this.newTaskForm.value);
    this.http
      .post(
        'http://localhost:3000/tasks/mytasks',
        this.newTaskForm.value
      )
      .subscribe(responseData => {
        console.log(responseData);
      })
  }
}
