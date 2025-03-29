import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],  
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // ✅ Corregido
})
export class AppComponent {
  title = 'Login_jairo';

  constructor(private router: Router) {}

  isAuthRoute(): boolean {
    return this.router.url.includes('/login') || this.router.url.includes('/register');
  }
}
