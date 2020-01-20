import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  animations: [
    trigger('showUserCard', [
      state('fadeIn',
        style({
          transform: 'tranlateY(0)',
          opacity: 1
        })
      ),
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
    ]),
    trigger('openCloseCard', [
      state('closed',
        style({
          height: '70px'
        })
      ),
      state('open',
        style({
          height: '400px'
        })
      ),
      transition('open <=> close', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class AccountComponent implements OnInit {
  showProfile = false;
  constructor() { }

  ngOnInit() {
  }

  showHiddenProfile() {
    this.showProfile = !this.showProfile;
  }

}
