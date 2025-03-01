import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  mostrarFormulario: string = 'login';

  mostrarLogin() {
    this.mostrarFormulario = 'login';
  }

  mostrarRegistro() {
    this.mostrarFormulario = 'registro';
  }
}
