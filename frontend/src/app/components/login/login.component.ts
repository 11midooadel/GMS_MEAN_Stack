import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { navForRole } from '../../core/nav/nav-items';

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
        // Land on whichever sidebar item is first for this role, so login always
        // matches what the menu actually shows instead of a hardcoded route.
        const items = navForRole(this.auth.role);
        this.router.navigate([items.length ? items[0].route : '/workouts']);
      },
      error: () => (this.loading = false),
    });
  }
}