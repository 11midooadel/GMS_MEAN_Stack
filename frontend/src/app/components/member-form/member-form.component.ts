import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService, User } from '../../core/services/users.service';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private dialogRef: MatDialogRef<MemberFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User; role?: string }
  ) {
    this.isEdit = !!this.data?.user;

    this.form = this.fb.group({
      name: [this.data?.user?.name || '', [Validators.required]],
      email: [this.data?.user?.email || '', [Validators.required, Validators.email]],
      role: [this.data?.user?.role?.toLowerCase() || this.data?.role?.toLowerCase() || 'member', [Validators.required]],
      phone: [this.data?.user?.phone || ''],
      password: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.invalid) return;

    const payload = { ...this.form.value };
    
    // Remove empty password field on edit so existing password remains untouched
    if (this.isEdit && !payload.password) {
      delete payload.password;
    }

    if (this.isEdit && this.data?.user?._id) {
      this.usersService.update(this.data.user._id, payload).subscribe({
        next: (updatedUser) => this.dialogRef.close(updatedUser),
        error: (err) => console.error('Failed to update role:', err)
      });
    } else {
      this.usersService.create(payload).subscribe({
        next: (createdUser) => this.dialogRef.close(createdUser),
        error: (err) => console.error('Failed to create user:', err)
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}