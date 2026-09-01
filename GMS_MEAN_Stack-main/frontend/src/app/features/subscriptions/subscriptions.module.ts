import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SubscriptionsPageComponent } from '../../components/subscriptions-page/subscriptions-page.component';

const routes: Routes = [{ path: '', component: SubscriptionsPageComponent }];

@NgModule({
  declarations: [SubscriptionsPageComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class SubscriptionsModule {}
