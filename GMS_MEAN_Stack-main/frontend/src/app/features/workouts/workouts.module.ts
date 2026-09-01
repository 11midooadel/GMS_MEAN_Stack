import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { WorkoutListComponent } from '../../components/workout-list/workout-list.component';

const routes: Routes = [{ path: '', component: WorkoutListComponent }];

@NgModule({
  declarations: [WorkoutListComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class WorkoutsModule {}
