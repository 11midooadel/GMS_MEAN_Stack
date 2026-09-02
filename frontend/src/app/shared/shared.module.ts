import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { WorkoutFormComponent } from '../components/workout-form/workout-form.component';
import { HealthHistoryDialogComponent } from '../components/health-history-dialog/health-history-dialog.component';

/** Re-exports everything feature modules commonly need. */
@NgModule({
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
  ],
  declarations: [
    ConfirmDialogComponent,
    WorkoutFormComponent,
    HealthHistoryDialogComponent
  ],
})
export class SharedModule {}
