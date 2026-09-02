import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../auth-shell.css'],
})
export class LoginComponent {
  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;

    const { email, password } = this.form.value;

    this.auth.login(email!, password!).subscribe({
      next: () => {
        const role = this.auth.role;

        if (role === 'Admin') {
          this.router.navigate(['/dashboard/admin']);
        } else if (role === 'Trainer') {
          this.router.navigate(['/dashboard/trainer']);
        } else if (role === 'Member') {
          this.router.navigate(['/dashboard/member']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => (this.loading = false),
    });
  }
}