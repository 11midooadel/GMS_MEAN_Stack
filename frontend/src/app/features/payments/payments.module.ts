import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { PaymentsPageComponent } from '../../components/payments-page/payments-page.component';
import { PaymentFormComponent } from '../../components/payment-form/payment-form.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

const routes: Routes = [{ path: '', component: PaymentsPageComponent }];

@NgModule({
  declarations: [PaymentsPageComponent, PaymentFormComponent],
  imports: [SharedModule, ReactiveFormsModule, MatAutocompleteModule, RouterModule.forChild(routes)],
})
export class PaymentsModule { }
