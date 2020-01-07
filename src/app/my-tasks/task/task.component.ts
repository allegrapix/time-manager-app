import { Component, OnInit, OnDestroy } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Task } from './task.model';
import { Subscription } from 'rxjs';
import { trigger, transition, style, group, animate, query } from '@angular/animations';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  animations: [
    trigger('taskContentAnimation', [
      transition(':enter', [
        style({ height: '0px', overflow: 'hidden' }),
        group([animate('350ms ease-out', style({ height: '!' }))])
      ])
    ])
  ]
})
export class TaskComponent implements OnInit, OnDestroy {
  task: Task = {
    _id: null,
    title: '',
    status: '',
    workedHours: 0,
    description: ''
  };
  color: string;
  queryParamsSub: Subscription;
  statusParam: string;

  constructor(
    private tasksService: TasksService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.statusParam = this.route.snapshot.queryParams['status'];
    this.tasksService.getTask(id).subscribe(resData => {
      this.task = resData;
      this.color = this.tasksService.getColor(this.task.status);
    });
    this.route.params.subscribe(
      (updatedParams: Params) => {
        this.tasksService.getTask(updatedParams['id']).subscribe(resData => {
          this.task = resData;
          this.color = this.tasksService.getColor(this.task.status);
        });
      }
    );
  }

  getColor() {
    return this.color;
  }

  goToEditTask() {
    this.router.navigate(['edit-task'], {queryParams: {status: this.statusParam}, relativeTo: this.route});
  }

  ngOnDestroy() {

  }
}
