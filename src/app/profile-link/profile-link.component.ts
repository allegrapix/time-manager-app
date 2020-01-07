import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-link',
  templateUrl: './profile-link.component.html',
  styleUrls: ['./profile-link.component.scss']
})
export class ProfileLinkComponent implements OnInit {
  profileImg = '../../assets/img/robot.png';

  constructor() { }

  ngOnInit() {
  }

}
