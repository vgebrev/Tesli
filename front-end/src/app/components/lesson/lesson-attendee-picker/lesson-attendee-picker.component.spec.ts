import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonAttendeePickerComponent } from './lesson-attendee-picker.component';

describe('LessonAttendeePickerComponent', () => {
  let component: LessonAttendeePickerComponent;
  let fixture: ComponentFixture<LessonAttendeePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessonAttendeePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonAttendeePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
