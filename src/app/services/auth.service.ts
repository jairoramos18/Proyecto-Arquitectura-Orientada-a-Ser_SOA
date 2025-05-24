import { Injectable, inject } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  sendPasswordResetEmail,
  GithubAuthProvider
} from 'firebase/auth';
import { Auth } from '@angular/fire/auth'; 
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth); 

  register(user: User) {
    return createUserWithEmailAndPassword(this.auth, user.email, user.password);
  }

  logIn(user: User) {
    return signInWithEmailAndPassword(this.auth, user.email, user.password);
  }

  logInGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logInFacebook() {
    return signInWithPopup(this.auth, new FacebookAuthProvider());
  }

  logInGitHub() {
    return signInWithPopup(this.auth, new GithubAuthProvider());
  }

  logLogout() {
    return signOut(this.auth);
  }

  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  sendPasswordReset(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }
}
