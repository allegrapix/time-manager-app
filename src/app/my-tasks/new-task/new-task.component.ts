import { Component, OnInit } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(
    private router: Router,
    private tasksService: TasksService
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
    this.tasksService.postTask(this.newTaskForm.value).subscribe(resData => {
      this.router.navigate(['/mytasks', resData._id]);
      this.tasksService.taskListModified.emit();
    });
  }
}
