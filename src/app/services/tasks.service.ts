import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Task } from '../my-tasks/task/task.model';
import { ActivatedRoute } from '@angular/router';



@Injectable({providedIn: 'root'})
export class TasksService {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  tasks: Task[] = [];
  statuses = [
    { name: 'to do', value: 'todo' },
    { name: 'ongoing', value: 'ongoing' },
    { name: 'completed', value: 'completed' }
  ];
  url = 'http://localhost:3000';

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
    params = params.append("limit", limit.toString());
    params = params.append("skip", skip.toString());
    return this.http.get<Task[]>(`${this.url}/tasks/mytasks`, {params: params});
  }
  
  getTask(id: string) {
    return this.http.get<Task>(`${this.url}/tasks/mytasks/${id}`);
  }

  getColor(status: string) {
    let color = '';
    switch (status) {
      case 'ongoing': 
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
}