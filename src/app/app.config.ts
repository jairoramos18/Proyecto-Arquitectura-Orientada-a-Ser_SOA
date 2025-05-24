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
<<<<<<< feature/fredy-docs
  apiKey: "AIzaSyCAySq1PccS54-Np6vzt0oGFMsDaOf5WHE",
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
>>>>>>> Develop
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
