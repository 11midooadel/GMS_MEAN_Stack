import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ClassListComponent } from '../../components/class-list/class-list.component';
import { ClassFormComponent } from '../../components/class-form/class-form.component';
import { ClassMembersDialogComponent } from '../../components/class-members-dialog/class-members-dialog.component';

const routes: Routes = [
  { path: '', component: ClassListComponent },
  { path: 'mine', component: ClassListComponent, data: { enrolledOnly: true } },
];

@NgModule({
  declarations: [ClassListComponent, ClassFormComponent, ClassMembersDialogComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class ClassesModule {}
