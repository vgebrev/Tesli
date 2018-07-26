import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonAttendeeListComponent } from './lesson-attendee-list.component';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { LessonAttendee } from '../../../model/lesson-attendee';
import { Student } from '../../../model/student';

@Component({ selector: 'lesson-attendee-picker', template: '' })
class LessonAttendeePickerStubComponent {
  @Output() attendeePick: EventEmitter<LessonAttendee> = new EventEmitter();
}

@Component({ selector: 'lesson-attendee-detail', template: '' })
class LessonAttendeeDetailStubComponent  {
  @Input() student: Student;
  @Input() hasAttended: boolean;
  @Input() hasPaid: boolean;
  @Input() price: number;
  @Output() remove: EventEmitter<void> = new EventEmitter();
  @Output() update: EventEmitter<LessonAttendee> = new EventEmitter();
}

describe('LessonAttendeeListComponent', () => {
  let component: LessonAttendeeListComponent;
  let fixture: ComponentFixture<LessonAttendeeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LessonAttendeeListComponent,
        LessonAttendeePickerStubComponent,
        LessonAttendeeDetailStubComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonAttendeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
