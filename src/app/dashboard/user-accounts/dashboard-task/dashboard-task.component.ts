import { Component, OnInit, Input } from '@angular/core';
import { Task } from 'src/app/my-tasks/task/task.model';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-dashboard-task',
  templateUrl: './dashboard-task.component.html'
})
export class DashboardTaskComponent implements OnInit {
  @Input() task: Task;
  constructor(
    private tasksService: TasksService
    ) { }
  ngOnInit() {
  }

  getColor(status: string) {
    const color = this.tasksService.getColor(status);
    return color;
  }

  editSelectedTask() {

  }

  DeleteSelectedTask() {
    
  }

}
