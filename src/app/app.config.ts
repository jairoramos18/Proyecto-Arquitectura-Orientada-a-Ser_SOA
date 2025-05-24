import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth'; 

import { HttpClientModule } from '@angular/common/http';
import { routes } from './app.routes';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "",
  authDomain: "agroca-60ba8.firebaseapp.com",
  projectId: "agroca-60ba8",
  storageBucket: "agroca-60ba8.firebasestorage.app",
  messagingSenderId: "96525118029",
  appId: "1:96525118029:web:14e9b8f9c3b0c30bfaca04"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()), // ✅ Añade esto
    HttpClientModule
  ]
};
