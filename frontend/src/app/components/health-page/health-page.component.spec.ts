import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthPageComponent } from './health-page.component';

describe('HealthPageComponent', () => {
  let component: HealthPageComponent;
  let fixture: ComponentFixture<HealthPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HealthPageComponent]
    });
    fixture = TestBed.createComponent(HealthPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
