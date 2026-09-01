import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AttendancePageComponent } from '../../components/attendance-page/attendance-page.component';

const routes: Routes = [{ path: '', component: AttendancePageComponent }];

@NgModule({
  declarations: [AttendancePageComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class AttendanceModule {}
