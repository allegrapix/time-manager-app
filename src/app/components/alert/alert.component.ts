import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes, group } from '@angular/animations';


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  animations: [
    trigger('backdrop', [
      state('fadeIn', style({
        opacity: 1
      })),
      transition('void => *', [
        style({
          opacity: 0
        }),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({
          opacity: 0
        }))
      ])
    ]),
    trigger('alertContainer', [
      state('in', style({
        opacity: 1
      })),
      transition('void => *', [
        style({
          opacity: 0
        }),
        animate(500)
      ]),
      transition('* => void', [
        animate(500, style({
          opacity: 0,
        }))
      ])
    ]),
  ]
})
export class AlertComponent implements OnInit {
  @Input() message: string;
  @Output() closeAlert = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {
  }

  onCloseAlert() {
    this.closeAlert.emit();
  }
}
