import { Component, OnInit, OnDestroy } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { Task } from '../task/task.model';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit, OnDestroy {
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
  newTaskForm: FormGroup;
  submitBtn = 'Create';

  constructor(
    private router: Router,
    private tasksService: TasksService,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {  
    this.statuses = this.tasksService.getStatuses();
    this.newTaskForm = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'status': new FormControl(null, Validators.required),
      'workedHours': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required)
    });    
    this.route.data.subscribe((data: Data) => {      
      this.task = data['task'];
      if (this.task) {
        this.newTaskForm.setValue({
          'title': this.task.title,
          'status': this.task.status,
          'workedHours': this.task.workedHours,
          'description': this.task.description
        });
        this.submitBtn = 'Save';
      }
    });
  }

  rotateArrow() {
    this.dropDownIsOpen = !this.dropDownIsOpen;
  }

  onSubmit() {
    if (this.task) {
      this.tasksService.editTask(this.task._id, this.newTaskForm.value).subscribe(resData => {
        this.navigateAfterSubmit(resData._id);
      })
    } else {
      this.tasksService.postTask(this.newTaskForm.value).subscribe(resData => {
        this.navigateAfterSubmit(resData._id);
      });
    }
  }

  navigateAfterSubmit(id: string) {
    this.tasksService.taskListModified.emit();
    this.router.navigate(['/mytasks', id]);
  }

  ngOnDestroy() {
  }
}
