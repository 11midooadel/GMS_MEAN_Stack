import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { HealthPageComponent } from '../../components/health-page/health-page.component';

const routes: Routes = [{ path: '', component: HealthPageComponent }];

@NgModule({
  declarations: [HealthPageComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class HealthModule {}
