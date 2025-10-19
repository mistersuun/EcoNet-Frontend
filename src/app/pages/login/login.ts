import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  returnUrl = '/admin';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Redirect to admin if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin']);
    }

    // Get return url from route parameters or default to '/admin'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';

    // Initialize form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    try {
      const result = await this.authService.signIn(email, password);

      if (result.success) {
        // Redirect to return URL or admin page
        this.router.navigate([this.returnUrl]);
      } else {
        this.errorMessage = result.error || 'Échec de la connexion. Veuillez vérifier vos identifiants.';
      }
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage = 'Une erreur est survenue lors de la connexion.';
    } finally {
      this.isSubmitting = false;
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
