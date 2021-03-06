import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LessonEditorComponent } from './lesson-editor.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppMaterialModule } from '../../../modules/app-material.module';
import { Component, Input } from '@angular/core';
import { LessonAttendee } from '../../../model/lesson-attendee';

@Component({  selector: 'lesson-date-time-picker',  template: '' })
class LessonDateTimePickerStubComponent {
  @Input() date: Date;
  @Input() startTime: string;
  @Input() endTime: string;
}

@Component({ selector: 'lesson-attendee-list', template: '' })
class LessonAttendeeListStubComponent {
  @Input() lessonId: number;
  @Input() lessonAttendees: LessonAttendee[];
}

class MatDialogRefMock {
  constructor() { }
}

describe('LessonEditorComponent', () => {
  let component: LessonEditorComponent;
  let fixture: ComponentFixture<LessonEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatDialogModule,
        AppMaterialModule
      ],
      declarations: [
        LessonEditorComponent,
        LessonDateTimePickerStubComponent,
        LessonAttendeeListStubComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: MatDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { data: { eventStart: new Date() } } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update lesson with date and time when onDateTimeChanged is called', () => {
    const dateTime = {
      date: new Date(2018, 6, 27, 15, 0),
      startTime: '15:00',
      endTime: '16:00'
    };

    component.onDateTimeChanged(dateTime);

    expect(component.lesson.date).toBe(dateTime.date);
    expect(component.lesson.startTime).toBe(dateTime.startTime);
    expect(component.lesson.endTime).toBe(dateTime.endTime);
  });
});
