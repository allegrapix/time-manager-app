import { Component, OnInit, Input } from '@angular/core';
import { Task } from 'src/app/my-tasks/task/task.model';

@Component({
  selector: 'app-dashboard-task',
  templateUrl: './dashboard-task.component.html'
})
export class DashboardTaskComponent implements OnInit {
  @Input() task: Task;
  constructor(
    ) { }
  ngOnInit() {
  }

}
