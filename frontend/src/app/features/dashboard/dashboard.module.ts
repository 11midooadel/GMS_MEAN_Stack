import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { TrainerDashboardComponent } from '../trainer-dashboard/trainer-dashboard.component';
import { MemberDashboardComponent } from '../member-dashboard/member-dashboard.component';
import { HomeComponent } from '../../components/home/home.component';
import { roleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [roleGuard],
    data: { roles: ['Admin', 'Super Admin'] },
  },
  {
    path: 'trainer',
    component: TrainerDashboardComponent,
    canActivate: [roleGuard],
    data: { roles: ['Trainer'] },
  },
  {
    path: 'member',
    component: MemberDashboardComponent,
    canActivate: [roleGuard],
    data: { roles: ['Member'] },
  },
  {
    path: '',
    component: HomeComponent,
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    AdminDashboardComponent,
    TrainerDashboardComponent,
    MemberDashboardComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class DashboardModule {}