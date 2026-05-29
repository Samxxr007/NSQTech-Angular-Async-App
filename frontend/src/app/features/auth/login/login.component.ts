import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../shared/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="branding-side">
        <div class="brand-content fade-in">
          <div class="logo-mark">🔍</div>
          <h1>MPloyChek</h1>
          <p>The OS for background verification. Built for modern enterprises.</p>
        </div>
      </div>

      <div class="form-side">
        <div class="login-card slide-up">
          <h2>Sign in to Workspace</h2>
          <p class="subtitle">
            Enter your details to access the dashboard.
          </p>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>Work Email</label>
              <input
                type="email"
                formControlName="email"
                placeholder="name@company.com"
              />
            </div>

            <div class="form-group">
              <label>Password</label>
              <input
                type="password"
                formControlName="password"
                placeholder="••••••••"
              />
            </div>

            <div class="form-group">
              <label>Workspace Role</label>
              <select formControlName="role">
                <option value="admin">Administrator</option>
                <option value="user">Verification Officer</option>
              </select>
            </div>

            @if (error) {
              <div class="error-msg fade-in">
                {{ error }}
              </div>
            }

            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="submit-btn"
            >
              @if (isLoading) {
                <span class="spinner">↻</span>
                Signing in...
              } @else {
                Continue to Dashboard
              }
            </button>
          </form>

          <div class="demo-creds fade-in">
            <h4>Evaluation Credentials</h4>

            <div class="cred-row">
              <span class="role">Admin</span>
              <span class="email">
                admin&#64;mploychek.com
              </span>
              <span class="pass">
                Admin&#64;123
              </span>
            </div>

            <div class="cred-row">
              <span class="role">Officer</span>
              <span class="email">
                user&#64;mploychek.com
              </span>
              <span class="pass">
                User&#64;123
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: [
      'admin@mploychek.com',
      [Validators.required, Validators.email]
    ],
    password: [
      'Admin@123',
      [Validators.required]
    ],
    role: [
      'admin',
      [Validators.required]
    ]
  });

  isLoading = false;
  error = '';

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = '';

      const payload: LoginRequest = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };

      console.log('LOGIN PAYLOAD', payload);

      this.authService.login(payload).subscribe({
        next: (response) => {
          console.log('LOGIN SUCCESS', response);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.error =
            'Invalid credentials. Please verify and try again.';
          console.error('LOGIN ERROR', err);
        }
      });
    }
  }
}