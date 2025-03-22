import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // ⬅ Agregar CommonModule para *ngIf
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../interfaces/user.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, // ⬅ Agregado para evitar el error de *ngIf
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ] as const,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]), // ⬅ Se agregó validación de email
    password: new FormControl('', [Validators.required, Validators.minLength(6)]) // ⬅ Validación de mínimo 6 caracteres
  });

  onSubmit() {
    if (this.form.valid) {
      this.authService.register(this.form.value as User)
        .then(() => {
          this.router.navigate(['/login']);
        })
        .catch(error => console.error('Error en registro:', error)); // ⬅ Manejo de error en el registro
    }
  }
}
