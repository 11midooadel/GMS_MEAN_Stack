import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { SubscriptionsPageComponent } from '../../components/subscriptions-page/subscriptions-page.component';
import { SubscriptionFormComponent } from '../../components/subscription-form/subscription-form.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

const routes: Routes = [
  { path: '', component: SubscriptionsPageComponent }
];

@NgModule({
  declarations: [
    SubscriptionsPageComponent,
    SubscriptionFormComponent
  ],
  imports: [
    SharedModule, 
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatAutocompleteModule
  ],
})
export class SubscriptionsModule {}