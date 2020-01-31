import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-view-task-icon',
  templateUrl: './view-task-icon.component.html',
  styleUrls: ['./view-task-icon.component.scss']
})
export class ViewTaskIconComponent implements OnInit {
  @Input() color: string;
  constructor() { }

  ngOnInit() {
  }

}
