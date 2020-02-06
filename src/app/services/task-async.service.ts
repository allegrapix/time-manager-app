import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class TaskAsyncService {
  url = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getTasksAsync() {
    return this.http.get(`${this.url}/tasks/mytasks`);
  }
}
