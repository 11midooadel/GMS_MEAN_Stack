import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isHandset = false;
  /** Controls the sidebar independently of screen size, via the navbar burger button. */
  sidebarOpen = true;
  private sub?: Subscription;

  constructor(private breakpoints: BreakpointObserver) {}

  ngOnInit(): void {
    this.sub = this.breakpoints
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .subscribe((r) => {
        this.isHandset = r.matches;
        this.sidebarOpen = !r.matches;
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggle(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  /** On mobile, close the drawer after navigating. */
  closeIfHandset(): void {
    if (this.isHandset) this.sidebarOpen = false;
  }
}
