import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonAttendanceListComponent } from './lesson-attendance-list.component';

describe('LessonAttendanceListComponent', () => {
  let component: LessonAttendanceListComponent;
  let fixture: ComponentFixture<LessonAttendanceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessonAttendanceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonAttendanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
