import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonAttendeeDetailComponent } from './lesson-attendee-detail.component';

describe('LessonAttendeeDetailComponent', () => {
  let component: LessonAttendeeDetailComponent;
  let fixture: ComponentFixture<LessonAttendeeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessonAttendeeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonAttendeeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
