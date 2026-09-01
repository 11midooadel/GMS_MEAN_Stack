import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MemberListComponent } from '../../components/member-list/member-list.component';
import { MemberFormComponent } from '../../components/member-form/member-form.component';

const routes: Routes = [
  { path: '', component: MemberListComponent },
  { path: 'trainers', component: MemberListComponent, data: { roleFilter: 'Trainer' } },
];

@NgModule({
  declarations: [MemberListComponent, MemberFormComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class MembersModule {}
