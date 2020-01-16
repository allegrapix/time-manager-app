import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit {
  public minDate: Date = new Date ("05/07/2017");
  public maxDate: Date = new Date ("08/27/2050");
  public selectedDate: Date = new Date ();
  public month: number = new Date().getMonth();
  public fullYear: number = new Date().getFullYear();
 

  constructor(private taskService: TasksService) { }

  ngOnInit() {
    this.taskService.newDateSelected.emit(this.selectedDate);
  }

  onChangeDate(event: Date) {
    this.taskService.newDateSelected.emit(this.selectedDate);
  }
}
