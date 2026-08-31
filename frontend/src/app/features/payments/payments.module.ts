import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PaymentsPageComponent } from '../../components/payments-page/payments-page.component';

const routes: Routes = [{ path: '', component: PaymentsPageComponent }];

@NgModule({
  declarations: [PaymentsPageComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class PaymentsModule {}
