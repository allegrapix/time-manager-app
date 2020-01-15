import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit {
  public minDate: Date = new Date ("05/07/2017");
  public maxDate: Date = new Date ("08/27/2050");
  public value: Date = new Date ();
  public month: number = new Date().getMonth();
  public fullYear: number = new Date().getFullYear();

  constructor() { }

  ngOnInit() {
    console.log(this.value);
    
  }

}
