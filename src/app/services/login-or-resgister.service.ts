import { EventEmitter } from '@angular/core';

export class LoginOrRegisterService {
  goToRegister = new EventEmitter<boolean>();
}
