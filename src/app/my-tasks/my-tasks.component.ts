import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TasksService } from '../services/tasks.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { trigger, transition, style, group, animate } from '@angular/animations';
import { Task } from './task/task.model';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss'],
  animations: [
    trigger('taskListAnimation', [
      transition(':enter', [
        style({
            opacity: 0,
            transform: 'translateX(-100px)'
          }),
        group([
          animate('250ms ease-in',
            style({
              opacity: 1,
              transform: 'translateX(0)'
            })
          )
        ])
      ])
    ])
  ]
})
export class MyTasksComponent implements OnInit, OnDestroy {
  @ViewChild('dropdownForm', {static: true}) dropdownForm: NgForm;
  defaultStatus = 'all';
  options = [
    { name: 'all', value: 'all' },
    { name: 'ongoing', value: 'ongoing' },
    { name: 'completed', value: 'completed' },
    { name: 'to do', value: 'todo' }
  ];
  dropDownIsOpen = false;
  tasks: Task[];
  queryParamsSubscription: Subscription;
  queryParams: string;
  noTaskSelected = true;
  queryParamsSub: Subscription;
  paramsSub: Subscription;
  idParam: string;
  taskListChangeSub: Subscription;
  statusParam: string;
  skip = 0;
  limit = 4;
  isfirstpage = true;
  islastpage = false;
  nrOfTasks;
  noTasksSelectedSub: Subscription;

  constructor(
    private tasksService: TasksService,
    private router: Router,
    private route: ActivatedRoute
    ) {
      this.loadTasks(this.skip, this.limit);
    }

  ngOnInit() {
    this.tasksService.noTasksSelected.subscribe(notSelected => {
      this.noTaskSelected = notSelected;
      if (this.noTaskSelected) {
        this.router.navigate(['noTask'], {relativeTo: this.route});
      }
    });
    this.taskListChangeSub = this.tasksService.taskListModified.subscribe(() => {
      this.loadTasks(this.skip, this.limit);
    });
  }

  addStatusParams(event: any) {
    this.skip = 0;
    if (event.target.value !== 'all') {
      this.router.navigate([], {
        queryParams: {
          status: event.target.value
        },
        queryParamsHandling: 'merge'
      });
    } else {
      this.router.navigate([]);
    }
    this.loadTasks(this.skip, this.limit);
  }

  loadTasks(skip, limit) {
    this.statusParam = this.route.snapshot.queryParams['status'];
    this.queryParamsSub = this.route.queryParams.subscribe(updateQueryParams => {
      this.statusParam = updateQueryParams.status;
      this.tasksService.getAllTasks(this.statusParam).subscribe(resData => {
        this.nrOfTasks = resData.length;
        this.checkPages();
      });
      this.defaultStatus = this.statusParam ? this.statusParam : 'all';
      this.tasksService.getTasks(this.statusParam, skip, limit).subscribe(resData => {
        this.tasks = resData;
      });
    });
  }

  goToTask(id: string) {
    this.noTaskSelected = false;
    this.router.navigate([id], {queryParams: {status: this.statusParam}, relativeTo: this.route});
  }

  goToNewTask() {
    this.noTaskSelected = false;
    this.router.navigate(['new'], {queryParams: {status: this.statusParam}, relativeTo: this.route});
  }

  rotateArrow() {
    this.dropDownIsOpen = !this.dropDownIsOpen;
  }

  getColor(status: string) {
    const color = this.tasksService.getColor(status);
    return color;
  }

  previousTasks() {
    this.skip -= this.limit;
    this.loadTasks(this.skip, this.limit);
  }

  nextTasks() {
    this.skip += this.limit;
    this.loadTasks(this.skip, this.limit);
  }

  ngOnDestroy() {
    this.queryParamsSub.unsubscribe();
  }

  checkPages() {
    this.isfirstpage = this.skip <= 0 ? true : false;
    const lastpage = Math.ceil(this.nrOfTasks / this.limit) - 1;
    const currentPage = Math.ceil(this.skip / this.limit);
    this.islastpage = currentPage >= lastpage ? true : false;
  }
}
