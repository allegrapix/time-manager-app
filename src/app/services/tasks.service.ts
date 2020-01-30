import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Task } from '../my-tasks/task/task.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface TaskModalMode {
  userID: string;
  taskID: string;
}

@Injectable({providedIn: 'root'})
export class TasksService {
  constructor(
    private http: HttpClient
  ) {}

  tasks: Task[] = [];
  statuses = [
    { name: 'to do', value: 'todo' },
    { name: 'ongoing', value: 'ongoing' },
    { name: 'completed', value: 'completed' }
  ];
  url = 'http://localhost:3000';
  taskListModified = new EventEmitter<void>();
  @Output() taskModal = new EventEmitter<TaskModalMode>();
  @Output() closeTaskModal = new EventEmitter<Task>();
  @Output() newDateSelected = new EventEmitter<Date>();

  getStatuses() {
    return this.statuses;
  }

  getAllTasks(statusParam) {
    let params = new HttpParams();
    params = params.append("status", statusParam);
    return this.http.get<Task[]>(`${this.url}/tasks/mytasks`, {params: params});
  }

  getTasks(statusParam, skip, limit) {
    let params = new HttpParams();   
    params = params.append("status", statusParam);
    if (skip !== undefined) {
      params = params.append("skip", skip.toString());
    }
    if (limit !== undefined) {
      params = params.append("limit", limit.toString());
    }
    params = params.append("sortBy", 'createdAt:desc');
    return this.http.get<Task[]>(`${this.url}/tasks/mytasks`, {params: params});
  }

  getUserTasks(id: string) {
    return this.http
    .get<Task[]>(`${this.url}/tasks/${id}`)
    .pipe(
      catchError(this.handleError)
    );
  }
  
  getTask(id: string) {
    return this.http.get<Task>(`${this.url}/tasks/mytasks/${id}`);
  }

  getUserTask(userID: string, taskID: string) {
    return this.http.get<Task>(`${this.url}/tasks/${userID}/${taskID}`);
  }

  getColor(status: string) {
    let color = '';
    switch (status) {
      case 'ongoing': 
        color = '#EF463F';
        break;
      case '': 
        color = '#EF463F';
        break;
      case 'completed': 
        color = '#6FBD97';
        break;
      case 'todo': 
        color = '#334763';
        break;        
    }
    return color;
  }

  postTask(task: Task) {
    return this.http
    .post<Task>(`${this.url}/tasks/mytasks`, task)
    .pipe(
      catchError(this.handleError)
    );
  }

  postTaskByAdmin(userID: string, task: Task) {
    return this.http
    .post<Task>(`${this.url}/tasks/${userID}`, task)
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMsg = 'An error ocurred';
    if (!errorRes.error) {
      return throwError(errorMsg);
    }
    return throwError(errorRes.error);
  }

  deleteTask(id: string) {
    return this.http
    .delete<Task>(`${this.url}/tasks/mytasks/${id}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  deleteTaskByAdmin(userID: string, taskID: string) {
    return this.http
    .delete<Task>(`${this.url}/tasks/${userID}/${taskID}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  editTask(id: string, task: Task) {
    return this.http
    .patch<Task>(`${this.url}/tasks/mytasks/${id}`, task)
    .pipe(
      catchError(this.handleError)
    )
  }

  editTaskByAdmin(userID: string, taskID: string, task: Task) {
    return this.http
    .patch<Task>(`${this.url}/tasks/${userID}/${taskID}`, task)
    .pipe(
      catchError(this.handleError)
    )
  }
}