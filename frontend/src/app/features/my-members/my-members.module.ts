import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MyMembersComponent } from '../../components/my-members/my-members.component';

const routes: Routes = [{ path: '', component: MyMembersComponent }];

@NgModule({
  declarations: [
    MyMembersComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class MyMembersModule {}
