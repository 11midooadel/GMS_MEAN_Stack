import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PlansPageComponent } from '../../components/plans-page/plans-page.component';

const routes: Routes = [{ path: '', component: PlansPageComponent }];

@NgModule({
  declarations: [PlansPageComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class PlansModule {}
