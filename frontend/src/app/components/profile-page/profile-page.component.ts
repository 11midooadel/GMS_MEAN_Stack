import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../core/services/users.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/models';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit {
  me: User | null = null;
  saving = false;
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
  });

  constructor(
    private fb: FormBuilder,
    private users: UsersService,
    private auth: AuthService,
    private snack: MatSnackBar
  ) {}

  get initials(): string {
    const n = this.me?.name ?? '?';
    return n.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }

  ngOnInit(): void {
    this.auth.getProfile().subscribe((res) => {
      this.me = res.user;
      this.form.patchValue({ name: res.user.name, email: res.user.email });
    });
  }

  save(): void {
    if (this.form.invalid || !this.me) return;
    this.saving = true;
    const v = this.form.value;
    const body: any = { name: v.name, email: v.email };
    if (v.password) body.password = v.password;
    const id = this.me._id || this.auth.currentUser!.id;
    this.users.update(id, body).subscribe({
      next: () => {
        this.snack.open('Profile updated', 'OK', { duration: 3000 });
        this.saving = false;
      },
      error: () => (this.saving = false),
    });
  }
}
