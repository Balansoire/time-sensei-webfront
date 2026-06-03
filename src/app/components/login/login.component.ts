import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = signal('');
  password = signal('');
  isLoading = signal(false);
  error = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    if (!this.username() || !this.password()) {
      this.error.set('Veuillez remplir tous les champs');
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    this.authService.login(this.username(), this.password()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/selection']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set('Erreur de connexion');
      }
    });
  }

  onDemoLogin(): void {
    this.username.set('demo');
    this.password.set('password');
    setTimeout(() => this.onLogin(), 100);
  }
}
