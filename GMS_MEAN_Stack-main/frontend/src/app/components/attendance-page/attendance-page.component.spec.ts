import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancePageComponent } from './attendance-page.component';

describe('AttendancePageComponent', () => {
  let component: AttendancePageComponent;
  let fixture: ComponentFixture<AttendancePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendancePageComponent]
    });
    fixture = TestBed.createComponent(AttendancePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
