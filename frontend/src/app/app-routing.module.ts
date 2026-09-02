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
      // 1. Dashboard (Restricted strictly to Super Admin)
      {
  path: 'dashboard',
  canActivate: [roleGuard],
  data: { roles: ['super_admin', 'Super Admin', 'admin', 'Admin'] },
  loadChildren: () =>
    import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule),
},

      // 2. Members Management
      {
        path: 'members',
        canActivate: [roleGuard],
        data: { roles: ['super_admin', 'Super Admin', 'admin', 'Admin', 'trainer', 'Trainer'] },
        loadChildren: () =>
          import('./features/members/members.module').then((m) => m.MembersModule),
      },

      // 3. Classes
      { path: 'my-members',
        canActivate: [roleGuard], data: { roles: ['Trainer'] },
        loadChildren: () => import('./features/my-members/my-members.module').then((m) => m.MyMembersModule) },

      {
        path: 'classes',
        loadChildren: () =>
          import('./features/classes/classes.module').then((m) => m.ClassesModule),
      },

      // 4. Workouts
      {
        path: 'workouts',
        loadChildren: () =>
          import('./features/workouts/workouts.module').then((m) => m.WorkoutsModule),
      },

      // 5. Attendance
      {
        path: 'attendance',
        canActivate: [roleGuard],
        data: { roles: ['super_admin', 'Super Admin', 'admin', 'Admin', 'trainer', 'Trainer'] },
        loadChildren: () =>
          import('./features/attendance/attendance.module').then((m) => m.AttendanceModule),
      },

      // 6. Membership Plans
      {
        path: 'plans',
        loadChildren: () =>
          import('./features/plans/plans.module').then((m) => m.PlansModule),
      },

      // 7. Subscriptions
      {
        path: 'subscriptions',
        loadChildren: () =>
          import('./features/subscriptions/subscriptions.module').then((m) => m.SubscriptionsModule),
      },

      // 8. Payments
      {
        path: 'payments',
        canActivate: [roleGuard],
        data: { roles: ['super_admin', 'Super Admin', 'admin', 'Admin'] },
        loadChildren: () =>
          import('./features/payments/payments.module').then((m) => m.PaymentsModule),
      },

      // 9. Health Records
      {
        path: 'health',
        loadChildren: () =>
          import('./features/health/health.module').then((m) => m.HealthModule),
      },

      // 10. Profile
      {
        path: 'profile',
        loadChildren: () =>
          import('./features/profile/profile.module').then((m) => m.ProfileModule),
      },

      // Default redirect
      { path: '', redirectTo: 'workouts', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'workouts' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}