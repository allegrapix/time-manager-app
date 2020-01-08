import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TasksService } from 'src/app/services/tasks.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Task } from '../task/task.model';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {
  editTaskForm: FormGroup;
  dropDownIsOpen = false;
  statuses = [];
  task: Task = {
    _id: null,
    title: '',
    status: '',
    workedHours: 0,
    description: ''
  }

  constructor(
    private tasksService: TasksService,
    private router: Router,
    private route: ActivatedRoute
  ) { 

  }

  ngOnInit() {
    this.statuses = this.tasksService.getStatuses();
    this.editTaskForm = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'status': new FormControl(null, Validators.required),
      'workedHours': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required)
    });
    
    const id = this.route.snapshot.params['id'];
    this.tasksService.getTask(id).subscribe(resData => {
      this.task = resData;
      this.editTaskForm.setValue({
        'title': this.task.title,
        'status': this.task.status,
        'workedHours': this.task.workedHours,
        'description': this.task.description
      })

    });
  }

  rotateArrow() {
    this.dropDownIsOpen = !this.dropDownIsOpen;
  }

  onSaveChanges() {
    this.tasksService.editTask(this.task._id, this.editTaskForm.value).subscribe(resData => {
      console.log(resData);
      this.tasksService.taskListModified.emit();
      this.router.navigate(['/mytasks', this.task._id]);
    });
  }
}
