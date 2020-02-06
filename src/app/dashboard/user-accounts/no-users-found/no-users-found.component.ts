import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-no-users-found',
  templateUrl: './no-users-found.component.html',
  styleUrls: ['./no-users-found.component.scss'],
  animations: [
    trigger('showMsg', [
      transition('void => *', [
        style({
          transform: 'translateY(-100px)',
          opacity: 0
        }),
        animate(200)
      ]),
      transition('* => void', [
        animate(200,
          style({
            transform: 'translateY(100px)',
            opacity: 0
          })
        )
      ])
    ])
  ]
})
export class NoUsersFoundComponent implements OnInit {
  @Input() searchMsg;

  constructor(private userService: UserService) { }

  ngOnInit() {
  }
}
