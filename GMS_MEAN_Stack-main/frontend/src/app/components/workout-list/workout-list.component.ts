import { Component, OnInit } from '@angular/core';
import { WorkoutPlansService } from '../../core/services/workout-plans.service';
import { AuthService } from '../../core/services/auth.service';
import { WorkoutPlan } from '../../core/models/models';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css'],
})
export class WorkoutListComponent implements OnInit {
  loading = true;
  plans: WorkoutPlan[] = [];

  constructor(
    private svc: WorkoutPlansService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const req = this.auth.hasRole('Member')
      ? this.svc.byMember(this.auth.currentUser!.id)
      : this.svc.getAll();

    req.subscribe({
      next: (data) => { this.plans = data; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  totalExercises(p: WorkoutPlan): number {
    return (p.days || []).reduce((sum, d) => sum + (d.exercises?.length || 0), 0);
  }
}
