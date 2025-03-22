import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    
    constructor() { }

    getAuth(){
        return getAuth();
    }

    register(user: User){
        return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
    }

    logIn(user: User){
        return signInWithEmailAndPassword(getAuth(), user.email, user.password);
    }

    logInGoogle(){
        return signInWithPopup(getAuth(), new GoogleAuthProvider());
    }

    logLogout(){
      return signOut(getAuth());
  }
  
  isAuthenticated(): boolean {
      const user = getAuth().currentUser;
      return user !== null;
  }
  
}
