import { Injectable, inject } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  sendPasswordResetEmail,
  GithubAuthProvider,
  UserCredential,
  User as FirebaseAuthUser // Renombrado para evitar conflicto con tu User interface
} from 'firebase/auth';
import { Auth } from '@angular/fire/auth'; 
import { User } from '../interfaces/user.interface'; // Tu interfaz de usuario existente
import { AuditoriaService } from './auditoria.service';
import { Observable, from, of } from 'rxjs'; // Importar 'of' para Observables de valores
import { map, catchError, switchMap, tap } from 'rxjs/operators'; // Importar 'tap'

// Importaciones para Firestore
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth); 
  private auditoriaService = inject(AuditoriaService);
  private firestore = inject(Firestore); // Inyectar Firestore

  // Función auxiliar para guardar el perfil de usuario en Firestore
  private async saveUserProfileToFirestore(uid: string, email: string, nombre: string | null, telefono: string | null): Promise<void> {
    const userProfileRef = doc(this.firestore, 'userProfiles', uid); // Colección 'userProfiles', ID del documento es el UID del usuario
    const profileData: { email: string, nombre?: string, telefono?: string } = { email: email };

    if (nombre) {
      profileData.nombre = nombre;
    }
    if (telefono) {
      profileData.telefono = telefono;
    }

    await setDoc(userProfileRef, profileData, { merge: true }); // Usar merge para actualizar o crear
    console.log(`✅ Perfil de usuario guardado/actualizado en Firestore para UID: ${uid}`);
  }

  // Función auxiliar para obtener el perfil de usuario de Firestore
  private async getUserProfileFromFirestore(uid: string): Promise<{ nombre?: string, telefono?: string }> {
    const userProfileRef = doc(this.firestore, 'userProfiles', uid);
    const docSnap = await getDoc(userProfileRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(`✅ Perfil de usuario obtenido de Firestore para UID: ${uid}`, data);
      return { nombre: data?.['nombre'] || null, telefono: data?.['telefono'] || null };
    } else {
      console.warn(`⚠️ No se encontró perfil de usuario en Firestore para UID: ${uid}`);
      return {}; // Retorna un objeto vacío si no se encuentra
    }
  }


  // Método de registro: Ahora guarda el perfil del usuario en Firestore después de crear la cuenta.
  register(user: User): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, user.email, user.password)).pipe(
      switchMap(userCredential => {
        const firebaseUser: FirebaseAuthUser = userCredential.user;
        const email = firebaseUser.email || user.email;
        const name = user.nombre || null; // El nombre viene del formulario de registro
        const phone = user.telefono || null; // El teléfono viene del formulario de registro

        // Guardar el perfil de usuario en Firestore
        return from(this.saveUserProfileToFirestore(firebaseUser.uid, email, name, phone)).pipe(
          switchMap(() => {
            // Luego, registrar el evento de REGISTRO en la auditoría
            return this.auditoriaService.registrarAutenticacion(email!, name, phone, 'REGISTRO_PERSONALIZADO');
          }),
          map(() => userCredential) // Retornar las credenciales originales
        );
      }),
      catchError(error => {
        console.error("Error en register:", error);
        return from(Promise.reject(error));
      })
    );
  }

  // Método de login personalizado: Ahora recupera el perfil de usuario de Firestore para la auditoría.
  logIn(user: User): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, user.email, user.password)).pipe(
      switchMap(userCredential => {
        const firebaseUser: FirebaseAuthUser = userCredential.user;
        const email = firebaseUser.email || user.email;

        // Intentar obtener el nombre y teléfono del perfil de usuario en Firestore
        return from(this.getUserProfileFromFirestore(firebaseUser.uid)).pipe(
          switchMap(profile => {
            const name = profile.nombre || firebaseUser.displayName || null; // Prioriza el nombre de Firestore, luego Firebase Auth
            const phone = profile.telefono || null; // Prioriza el teléfono de Firestore

            return this.auditoriaService.registrarAutenticacion(email!, name, phone, 'LOGIN_PERSONALIZADO').pipe(
              map(() => userCredential)
            );
          })
        );
      }),
      catchError(error => {
        console.error("Error en logIn:", error);
        return from(Promise.reject(error));
      })
    );
  }

  // Métodos de login con OAuth (Google, Facebook, GitHub):
  // También intentarán obtener el perfil de Firestore, pero si no existe, usarán los datos de OAuth.
  // Es importante que la colección 'userProfiles' se pueble también para usuarios OAuth si se necesita persistir más datos.
  // Por ahora, solo usaré los datos de OAuth y luego intentaré guardar/actualizar el perfil.
  private processOAuthUserAndAudit(userCredential: UserCredential, method: string): Observable<UserCredential> {
    const firebaseUser: FirebaseAuthUser = userCredential.user;
    const email = firebaseUser.email || (firebaseUser.uid + "@" + method.toLowerCase() + ".com"); // Fallback para GitHub
    const name = firebaseUser.displayName || null;
    const phone = null; // Generalmente no viene por OAuth

    return from(this.saveUserProfileToFirestore(firebaseUser.uid, email, name, phone)).pipe( // Guardar/actualizar perfil OAuth
      switchMap(() => {
        return this.auditoriaService.registrarAutenticacion(email!, name, phone, method);
      }),
      map(() => userCredential)
    );
  }

  logInGoogle(): Observable<UserCredential> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(
      switchMap(userCredential => this.processOAuthUserAndAudit(userCredential, 'GOOGLE')),
      catchError(error => {
        console.error("Error en logInGoogle:", error);
        return from(Promise.reject(error));
      })
    );
  }

  logInFacebook(): Observable<UserCredential> {
    return from(signInWithPopup(this.auth, new FacebookAuthProvider())).pipe(
      switchMap(userCredential => this.processOAuthUserAndAudit(userCredential, 'FACEBOOK')),
      catchError(error => {
        console.error("Error en logInFacebook:", error);
        return from(Promise.reject(error));
      })
    );
  }

  logInGitHub(): Observable<UserCredential> {
    return from(signInWithPopup(this.auth, new GithubAuthProvider())).pipe(
      switchMap(userCredential => this.processOAuthUserAndAudit(userCredential, 'GITHUB')),
      catchError(error => {
        console.error("Error en logInGitHub:", error);
        return from(Promise.reject(error));
      })
    );
  }

  logLogout(): Promise<void> {
    return signOut(this.auth);
  }

  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  sendPasswordReset(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }
}
