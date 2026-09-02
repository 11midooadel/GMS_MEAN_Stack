import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassMembersDialogComponent } from './class-members-dialog.component';

describe('ClassMembersDialogComponent', () => {
  let component: ClassMembersDialogComponent;
  let fixture: ComponentFixture<ClassMembersDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassMembersDialogComponent]
    });
    fixture = TestBed.createComponent(ClassMembersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
