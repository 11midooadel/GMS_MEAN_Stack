import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMembersComponent } from './my-members.component';

describe('MyMembersComponent', () => {
  let component: MyMembersComponent;
  let fixture: ComponentFixture<MyMembersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyMembersComponent]
    });
    fixture = TestBed.createComponent(MyMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
