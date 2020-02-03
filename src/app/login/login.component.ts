import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginOrRegisterService } from '../services/login-or-resgister.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  signinForm: FormGroup;
  bannerText = 'Time is of the essence';
  isLoading = false;
  errorMsg: string = null;
  error = 'error';

  constructor(
    private router: Router,
    private logOrRegServ: LoginOrRegisterService,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.signinForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required)
    });
  }

  onSignIn() {
    if (!this.signinForm.value) {
      return;
    }
    this.isLoading =  true;
    const { email, password } = this.signinForm.value;
    this.authService.login(email, password).subscribe(responseData => {
      setTimeout(() => {
        this.isLoading = false;
        this.errorMsg = null;
        this.signinForm.reset();
        this.router.navigate(['/myprofile']);
      }, 300);
    }, error => {
      setTimeout(() => {
        this.isLoading = false;
        this.errorMsg = error;
      }, 300);
    })
  }

  toRegister() {
    this.logOrRegServ.goToRegister.emit(true);
    this.router.navigate(['/register']);
  }
}
