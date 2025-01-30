import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private emailValidated: boolean = false;

    constructor() { }

    validateEmail() {
        this.emailValidated = true;
    }

    isEmailValidated(): boolean {
        return this.emailValidated;
    }
}
