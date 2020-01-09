import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Task } from '../my-tasks/task/task.model';
import { TasksService } from './tasks.service';
import { Observable } from 'rxjs';

@Injectable()
export class TaskResolver implements Resolve<Task> {
  constructor(
    private taskService: TasksService
    ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Task> | Promise<Task> {
    console.log(route.params);
    return this.taskService.getTask(route.params.id);
  }
}