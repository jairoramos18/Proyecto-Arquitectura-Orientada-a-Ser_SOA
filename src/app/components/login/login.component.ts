import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ] as const,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export  class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  onSubmit() {
    if (this.form.valid) {
      this.authService.logIn(this.form.value as User)
        .then(resp => {
          this.router.navigate(['/dashboard']);
        })
        .catch(error => console.log(error));
    }
  }

  onClickGoogle() {
    this.authService.logInGoogle()
      .then(resp => {
        this.router.navigate(['/dashboard']);
      })
      .catch(error => console.log(error));
  }
}
