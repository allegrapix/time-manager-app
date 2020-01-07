import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-mainbody',
  templateUrl: './mainbody.component.html',
  styleUrls: ['./mainbody.component.scss']
})
export class MainbodyComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }

  prepareRoute(outlet: RouterOutlet) {
    console.log(outlet);
    
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

}
