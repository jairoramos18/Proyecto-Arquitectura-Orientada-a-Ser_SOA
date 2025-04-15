import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { initializeApp } from "firebase/app";
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { HttpClientModule } from '@angular/common/http';

//  Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAnJGfEWNbNdJL4rYgf2vC_Pe-KTMEFX4c",
  authDomain: "proyecto-arquitectura-5fb60.firebaseapp.com",
  projectId: "proyecto-arquitectura-5fb60",
  storageBucket: "proyecto-arquitectura-5fb60.firebasestorage.app",
  messagingSenderId: "298645157196",
  appId: "1:298645157196:web:91d41cea114aa13d354be9"
};

// Inicializar Firebase
initializeApp(firebaseConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(
      HttpClientModule,
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFirestoreModule
    )
  ]
};
