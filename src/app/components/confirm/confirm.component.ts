import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  @Output() closeConfirm = new EventEmitter<void>();
  @Input() taskID;
  @Input() userID;
  constructor(
    private taskService: TasksService
  ) { }

  ngOnInit() {
  }

  cancelDelete() {
    this.taskService.deleteTaskConfirmedByAdmin.emit(false);
  }

  confirmDelete() {
    this.taskService.deleteTaskByAdmin(this.userID, this.taskID).subscribe(task => {  
    })
    this.taskService.deleteTaskConfirmedByAdmin.emit(true);
  }
}
