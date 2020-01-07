import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoginOrRegisterService } from '../services/login-or-resgister.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild('arrow', {static: true}) arrow: ElementRef;
  signupForm: FormGroup;
  bannerText = 'Time is of the essence';
  roles = ['user', 'manager', 'admin'];
  dropDownIsOpen = false;
  samePass = '';
  isLoading = false;
  errorMsg: string = null;

  constructor(
    private router: Router,
    private logOrRegServ: LoginOrRegisterService,
    private authService: AuthService
    ) {
      this.logOrRegServ.goToRegister.emit(true);
    }

  ngOnInit() {
    this.signupForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, this.validatePassword.bind(this)]),
      're-password': new FormControl(null, [Validators.required, this.confirmPassword.bind(this)]),
    });
  }

  toLogin() {
    this.logOrRegServ.goToRegister.emit(false);
    this.router.navigate(['/login']);
  }

  rotateArrow() {
    this.dropDownIsOpen = !this.dropDownIsOpen;
  }

  validatePassword(control: FormControl): {[s:string]: boolean} {
    const reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!reg.test(control.value)) {
      return {'validationError': true}
    }
    this.samePass = control.value;
    return null;
  }

  confirmPassword(control: FormControl): {[s:string]: boolean} {
    if(control.value !== this.samePass) {
      return {'validationError': true}
    }    
    return null;
  }

  onSubmit() {
    if (!this.signupForm.value) {
      return;      
    }
    this.isLoading = true;
    const role = 'user';
    const { name, email, password } = this.signupForm.value;
    this.authService.register(name, email, role, password).subscribe(responseData => {
      setTimeout(() => {
        this.isLoading = false;
        this.errorMsg = null;
        this.signupForm.reset();
        this.router.navigate(['/myprofile']);
      }, 300);
    }, error => {
      setTimeout(() => {
        this.isLoading = false;
        this.errorMsg = error;
      }, 300);
    });
  }
}
