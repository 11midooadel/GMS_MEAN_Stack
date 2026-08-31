import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ClassListComponent } from '../../components/class-list/class-list.component';
import { ClassFormComponent } from '../../components/class-form/class-form.component';

const routes: Routes = [{ path: '', component: ClassListComponent }];

@NgModule({
  declarations: [ClassListComponent, ClassFormComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class ClassesModule {}
