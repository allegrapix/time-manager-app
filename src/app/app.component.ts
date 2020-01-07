import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'time-mngmt-app';
  constructor(private authService: AuthService) {
    this.authService.autoLogin();
  }

  ngOnInit() {
    
  }
}
