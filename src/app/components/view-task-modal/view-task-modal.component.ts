import { Component, OnInit, Input } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { Task } from 'src/app/my-tasks/task/task.model';

@Component({
  selector: 'app-view-task-modal',
  templateUrl: './view-task-modal.component.html',
  styleUrls: ['./view-task-modal.component.scss']
})
export class ViewTaskModalComponent implements OnInit {
  @Input() userID;
  @Input() taskID;
  task: Task = {
    _id: null,
    title: '',
    status: '',
    workedHours: 0,
    description: ''
  };
  
  constructor(
    private taskService: TasksService
  ) { }

  ngOnInit() {
    this.taskService.getUserTask(this.userID, this.taskID).subscribe(task => {
      this.task = task;   
    });    
  }

  closeView() {
    this.taskService.closeViewTaskByAdmin.emit(true);
  }
}
