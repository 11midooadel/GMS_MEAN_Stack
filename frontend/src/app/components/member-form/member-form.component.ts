import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../core/services/users.service';
import { Role, User } from '../../core/models/models';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
})
export class MemberFormComponent {
  roles: Role[] = ['Member', 'Trainer', 'Admin', 'Super Admin'];
  saving = false;
  isEdit = !!this.data.user;

  form = this.fb.group({
    name: [this.data.user?.name ?? '', Validators.required],
    email: [this.data.user?.email ?? '', [Validators.required, Validators.email]],
    password: ['', this.data.user ? [] : [Validators.required, Validators.minLength(6)]],
    role: [this.data.user?.role ?? (this.data.defaultRole ?? 'Member'), Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private users: UsersService,
    private snack: MatSnackBar,
    private ref: MatDialogRef<MemberFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User; defaultRole?: Role }
  ) {}

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const v = this.form.value;
    const body: any = { name: v.name, email: v.email, role: v.role };
    if (v.password) body.password = v.password;

    const req = this.isEdit
      ? this.users.update(this.data.user!._id!, body)
      : this.users.create(body);

    req.subscribe({
      next: () => {
        this.snack.open(`User ${this.isEdit ? 'updated' : 'created'}`, 'OK', { duration: 3000 });
        this.ref.close(true);
      },
      error: () => (this.saving = false),
    });
  }
}
