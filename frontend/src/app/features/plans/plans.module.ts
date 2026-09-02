import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PlansPageComponent } from '../../components/plans-page/plans-page.component';
import { PlanFormComponent } from '../../components/plan-form/plan-form.component';

const routes: Routes = [{ path: '', component: PlansPageComponent }];

@NgModule({
  declarations: [PlansPageComponent, PlanFormComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class PlansModule {}
