import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthHistoryDialogComponent } from './health-history-dialog.component';

describe('HealthHistoryDialogComponent', () => {
  let component: HealthHistoryDialogComponent;
  let fixture: ComponentFixture<HealthHistoryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HealthHistoryDialogComponent]
    });
    fixture = TestBed.createComponent(HealthHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
