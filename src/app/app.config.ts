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
<<<<<<< HEAD
  apiKey: "AIzaSyCg6UoOX2I8U-eGx9av5Q61h7IZuOFmAoY",
  authDomain: "agroca-60ba8.firebaseapp.com",
  projectId: "agroca-60ba8",
  storageBucket: "agroca-60ba8.firebasestorage.app",
  messagingSenderId: "96525118029",
  appId: "1:96525118029:web:14e9b8f9c3b0c30bfaca04"
=======
  apiKey: "AIzaSyCAySq1PccS54-Np6vzt0oGFMsDaOf5WHE",
  authDomain: "proyecto-arqorser.firebaseapp.com",
  projectId: "proyecto-arqorser",
  storageBucket: "proyecto-arqorser.firebasestorage.app",
  messagingSenderId: "683315320755",
  appId: "1:683315320755:web:def0f2eed4d57247625dc6"
>>>>>>> d5f23dbee4d29c1518837fc2d6f4492f28cc08ba
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()), 
    HttpClientModule
  ]
};
