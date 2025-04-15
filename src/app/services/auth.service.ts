import { Injectable } from '@angular/core';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  private getAuthInstance() {
    return getAuth();
  }

  register(user: User) {
    return createUserWithEmailAndPassword(this.getAuthInstance(), user.email, user.password);
  }

  logIn(user: User) {
    return signInWithEmailAndPassword(this.getAuthInstance(), user.email, user.password);
  }

  logInGoogle() {
    return signInWithPopup(this.getAuthInstance(), new GoogleAuthProvider());
  }

  logInFacebook() {
    return signInWithPopup(this.getAuthInstance(), new FacebookAuthProvider());
  }

  logLogout() {
    return signOut(this.getAuthInstance());
  }

  isAuthenticated(): boolean {
    return this.getAuthInstance().currentUser !== null;
  }

  sendPasswordReset(email: string) {
    return sendPasswordResetEmail(this.getAuthInstance(), email);
  }
}
