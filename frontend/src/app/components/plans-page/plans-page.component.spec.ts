import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansPageComponent } from './plans-page.component';

describe('PlansPageComponent', () => {
  let component: PlansPageComponent;
  let fixture: ComponentFixture<PlansPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlansPageComponent]
    });
    fixture = TestBed.createComponent(PlansPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
