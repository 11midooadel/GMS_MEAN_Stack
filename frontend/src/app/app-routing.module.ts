import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule) },

      { path: 'members',
        canActivate: [roleGuard], data: { roles: ['Admin', 'Super Admin'] },
        loadChildren: () => import('./features/members/members.module').then((m) => m.MembersModule) },

      { path: 'my-members',
        canActivate: [roleGuard], data: { roles: ['Trainer'] },
        loadChildren: () => import('./features/my-members/my-members.module').then((m) => m.MyMembersModule) },

      { path: 'classes',
        loadChildren: () => import('./features/classes/classes.module').then((m) => m.ClassesModule) },

      { path: 'workouts',
        loadChildren: () => import('./features/workouts/workouts.module').then((m) => m.WorkoutsModule) },

      { path: 'attendance',
        loadChildren: () => import('./features/attendance/attendance.module').then((m) => m.AttendanceModule) },

      { path: 'plans',
        loadChildren: () => import('./features/plans/plans.module').then((m) => m.PlansModule) },

      { path: 'subscriptions',
        loadChildren: () => import('./features/subscriptions/subscriptions.module').then((m) => m.SubscriptionsModule) },

      { path: 'payments',
        loadChildren: () => import('./features/payments/payments.module').then((m) => m.PaymentsModule) },

      { path: 'health',
        loadChildren: () => import('./features/health/health.module').then((m) => m.HealthModule) },

      { path: 'profile',
        loadChildren: () => import('./features/profile/profile.module').then((m) => m.ProfileModule) },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
