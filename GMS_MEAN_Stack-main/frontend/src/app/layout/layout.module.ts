import { NgModule } from '@angular/core';
import { LayoutModule as CdkLayoutModule } from '@angular/cdk/layout';
import { SharedModule } from '../shared/shared.module';
import { MainLayoutComponent } from '../components/main-layout/main-layout.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@NgModule({
  declarations: [MainLayoutComponent, NavbarComponent, SidebarComponent],
  imports: [SharedModule, CdkLayoutModule],
  exports: [MainLayoutComponent],
})
export class LayoutModule {}
