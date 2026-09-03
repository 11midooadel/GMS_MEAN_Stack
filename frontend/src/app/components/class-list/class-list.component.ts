import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClassesService } from '../../core/services/classes.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { AuthService } from '../../core/services/auth.service';
import { GymClass, User } from '../../core/models/models';
import { ClassFormComponent } from '../class-form/class-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ClassMembersDialogComponent } from '../class-members-dialog/class-members-dialog.component';

type ViewMode = 'teaching' | 'enrolled' | 'browse';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.css'],
})
export class ClassListComponent implements OnInit {
  loading = true;
  classes: GymClass[] = [];
  enrolledIds = new Set<string>();

  constructor(
    private classesSvc: ClassesService,
    private enrollment: EnrollmentService,
    private auth: AuthService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  get isMember() { return this.auth.hasRole('member'); }
  get isTrainer() { return this.auth.hasRole('trainer'); }
  get isAdmin() { return this.auth.hasRole('admin', 'super_admin'); }

  /** 'teaching' = trainer viewing classes they teach; 'enrolled' = member's "My Classes"; 'browse' = everyone else browsing all classes. */
  get viewMode(): ViewMode {
    if (this.isTrainer) return 'teaching';
    if (this.route.snapshot.data['enrolledOnly']) return 'enrolled';
    return 'browse';
  }

  get title(): string {
    return this.viewMode === 'browse' ? 'Classes' : 'My Classes';
  }
  get subtitle(): string {
    switch (this.viewMode) {
      case 'teaching': return 'Classes you teach — only you can edit or delete these.';
      case 'enrolled': return "Classes you've joined. Leave one any time.";
      default: return 'Browse and join group training sessions.';
    }
  }

  ngOnInit(): void {
    this.load();
    // Needed on the browse page to freeze cards for classes already joined.
    if (this.isMember && this.viewMode === 'browse') {
      this.enrollment.myClasses().subscribe((list) =>
        list.forEach((c) => this.enrolledIds.add(c._id!))
      );
    }
  }

  load(): void {
    this.loading = true;
    const req =
      this.viewMode === 'teaching' ? this.classesSvc.myClasses() :
      this.viewMode === 'enrolled' ? this.enrollment.myClasses() :
      this.classesSvc.getAll();

    req.subscribe({
      next: (data) => { this.classes = data; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  trainerName(c: GymClass): string {
    return typeof c.trainer === 'object' ? (c.trainer as User).name : 'trainer';
  }

  /** Only the trainer who created the class (or an Admin) may edit/delete it — mirrors the backend's ownership check. */
  canEdit(c: GymClass): boolean {
    if (this.isAdmin) return true;
    if (!this.isTrainer) return false;
    const ownerId = typeof c.trainer === 'object' ? (c.trainer as User)._id : c.trainer;
    return ownerId === this.auth.currentUser?.id;
  }

  /** A class already joined shows as locked/static on the Browse page — leaving only happens from My Classes. */
  isFrozen(c: GymClass): boolean {
    return this.viewMode === 'browse' && this.enrolledIds.has(c._id!);
  }

  enroll(c: GymClass): void {
    this.enrollment.enroll(c._id!).subscribe(() => {
      this.enrolledIds.add(c._id!);
      this.snack.open(`You have been enrolled in ${c.name}.`, 'OK', { duration: 3000 });
    });
  }

  leave(c: GymClass): void {
    this.enrollment.leave(c._id!).subscribe(() => {
      this.enrolledIds.delete(c._id!);
      this.classes = this.classes.filter((x) => x._id !== c._id);
      this.snack.open(`You have left ${c.name}.`, 'OK', { duration: 3000 });
    });
  }

  viewMembers(c: GymClass): void {
    this.dialog.open(ClassMembersDialogComponent, {
      width: '400px',
      data: { classId: c._id!, className: c.name },
    });
  }

  openForm(c?: GymClass): void {
    this.dialog
      .open(ClassFormComponent, { width: '520px', data: { gymClass: c } })
      .afterClosed()
      .subscribe((changed) => changed && this.load());
  }

  remove(c: GymClass): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '360px',
        data: {
          title: 'Do you want to delete this class?',
          message: `"${c.name}" will be permanently removed, along with all member enrollments. This can't be undone.`,
          confirmText: 'Delete',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.classesSvc.delete(c._id!).subscribe(() => this.load());
      });
  }
}
