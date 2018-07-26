import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '../../../modules/app-material.module';
import { FormsModule } from '@angular/forms';

import { LessonAttendeeListComponent } from './lesson-attendee-list.component';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { LessonAttendee } from '../../../model/lesson-attendee';
import { Student } from '../../../model/student';
import { LessonRateService } from '../../../services/lesson-rate.service';

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
    const lessonRateServiceSpy = jasmine.createSpyObj<LessonRateService>(['getPrice']);
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AppMaterialModule,
        FormsModule
      ],
      declarations: [
        LessonAttendeeListComponent,
        LessonAttendeePickerStubComponent,
        LessonAttendeeDetailStubComponent
      ],
      providers: [
        { provide: LessonRateService, useValue: lessonRateServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonAttendeeListComponent);
    component = fixture.componentInstance;
    component.attendees = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
