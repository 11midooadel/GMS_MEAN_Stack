import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../core/services/users.service';
import { AuthService } from '../../core/services/auth.service';
import { Role, User } from '../../core/models/models';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit {
  roles: Role[] = ['member', 'trainer', 'admin'];
  trainers: User[] = [];
  saving = false;
  isEdit = !!this.data.user;

  form = this.fb.group({
    name: [this.data.user?.name ?? '', Validators.required],
    email: [this.data.user?.email ?? '', [Validators.required, Validators.email]],
    password: ['', this.data.user ? [] : [Validators.required, Validators.minLength(6)]],
    role: [this.data.user?.role ?? (this.data.defaultRole ?? 'member'), Validators.required],
    assignedTrainer: [this.currentTrainerId()],
  });

  constructor(
    private fb: FormBuilder,
    private users: UsersService,
    private auth: AuthService,
    private snack: MatSnackBar,
    private ref: MatDialogRef<MemberFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User; defaultRole?: Role }
  ) {}

  ngOnInit(): void {
    if (this.auth.hasRole('super_admin')) {
      this.roles = ['member', 'trainer', 'admin', 'super_admin'];
    }
    this.users.getAll().subscribe((all) => {
      this.trainers = all.filter((u) => u.role === 'trainer');
    });
  }

  /** The form's `assignedTrainer` needs a plain ID; the User model may carry it populated as an object. */
  private currentTrainerId(): string {
    const t = this.data.user?.assignedTrainer;
    if (!t) return '';
    return typeof t === 'object' ? (t._id ?? '') : t;
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const v = this.form.value;
    const body: any = { name: v.name, email: v.email, role: v.role };
    if (v.password) body.password = v.password;
    if (v.role === 'member') body.assignedTrainer = v.assignedTrainer || null;

    const req = this.isEdit
      ? this.users.update(this.data.user!._id!, body)
      : this.users.create(body);

    req.subscribe({
      next: () => this.finish(),
      error: (err) => {
        this.saving = false;
        this.snack.open(err?.error?.message || 'Failed to save user.', 'OK', { duration: 4000 });
      },
    });
  }

  private finish(): void {
    this.snack.open(`User ${this.isEdit ? 'updated' : 'created'} successfully.`, 'OK', { duration: 3000 });
    this.ref.close(true);
  }
}
