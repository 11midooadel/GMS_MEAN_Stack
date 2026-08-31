import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

interface StatCard {
  label: string; value: string; icon: string; tone: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  // NOTE: the progress figures below are demo values for the template.
  // Wire them to attendance/workout/health services per role as needed.
  progress = 75;
  readonly circumference = 2 * Math.PI * 52;

  stats: StatCard[] = [
    { label: 'Workout', value: '45 min', icon: 'exercise', tone: 'green' },
    { label: 'Calories', value: '520 kcal', icon: 'local_fire_department', tone: 'coral' },
    { label: 'Steps', value: '8,752', icon: 'directions_walk', tone: 'blue' },
    { label: 'Active Time', value: '1h 15m', icon: 'schedule', tone: 'purple' },
  ];

  week = [
    { d: 'M', v: 45 }, { d: 'T', v: 62 }, { d: 'W', v: 80 },
    { d: 'T', v: 40 }, { d: 'F', v: 70 }, { d: 'S', v: 55 }, { d: 'S', v: 30 },
  ];

  quickActions = [
    { label: 'Start Workout', icon: 'play_circle', route: '/workouts', tone: 'green' },
    { label: 'Log Food', icon: 'restaurant', route: '/health', tone: 'coral' },
    { label: 'Body Stats', icon: 'monitor_weight', route: '/health', tone: 'purple' },
    { label: 'Classes', icon: 'fitness_center', route: '/classes', tone: 'blue' },
  ];

  constructor(private auth: AuthService) {}

  get firstName(): string {
    return this.auth.currentUser?.name?.split(' ')[0] ?? 'there';
  }

  get dashOffset(): number {
    return this.circumference * (1 - this.progress / 100);
  }
}
