import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { LessonAttendeePickerComponent } from './lesson-attendee-picker.component';
import { LoadingIndicatorStubComponent } from '../../../../testing/loading-indicator.stub';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '../../../modules/app-material.module';
import { Student } from '../../../model/student';
import { of, throwError } from 'rxjs';
import { StudentService } from '../../../services/student.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';
import { LessonAttendee } from '../../../model/lesson-attendee';

describe('LessonAttendeePickerComponent', () => {
  let component: LessonAttendeePickerComponent;
  let fixture: ComponentFixture<LessonAttendeePickerComponent>;

  const students: Student[] = [
    { id: 1, name: 'First Student' },
    { id: 2, name: 'Second Learner' },
    { id: 3, name: 'Third Pupil' }
  ];

  function createStudentServiceSpy() {
    const studentServiceSpy = jasmine.createSpyObj('StudentService', ['getStudents']);
    studentServiceSpy.getStudents.and.callFake(() => of(students));
    return studentServiceSpy;
  }

  beforeEach(async(() => {
    const studentServiceSpy = createStudentServiceSpy();
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AppMaterialModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        LessonAttendeePickerComponent,
        LoadingIndicatorStubComponent
      ],
      providers: [
        { provide: StudentService, useValue: studentServiceSpy },
      ]
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

  it('should load students when getStudents is called', inject([StudentService], (service: StudentService) => {
    component.students = [];
    component.getStudents();
    expect(service.getStudents).toHaveBeenCalledTimes(2); // First call is in ngOnInit
    expect(component.students).toEqual(students);
  }));

  it('should handle service getStudents errors',
  inject([StudentService, NotificationService], (service: StudentService, notificationService: NotificationService) => {
    const erroringService = service as any;
    erroringService.getStudents.and.callFake(() => throwError('service error'));
    component.students = students;
    component.getStudents();
    expect(component.students).toEqual([]);
  }));

  it('should send getStudents error notification and retry when the notification callback is invoked',
  async(inject([StudentService, NotificationService], (service: StudentService, notificationService: NotificationService) => {
    const erroringService = service as any;
    erroringService.getStudents.and.callFake(() => throwError('service error'));
    notificationService.notification$.subscribe((notification) => {
      expect(notification.message).toBe('Unable to load students');
      expect(notification.action).toBe('Retry');
      expect(notification.config).toEqual({ duration: 5000});
      const retryGetStudents = spyOn(component, 'getStudents');
      notification.callback();
      expect(retryGetStudents).toHaveBeenCalledTimes(1);
    });
    component.getStudents();
  })));

  it('pickAttendee should return immediately when called without a selected student', () => {
    component.selectedStudent.setValue(null);
    component.attendeePick.subscribe(() => {
      expect(true).toBeFalsy('attendeePick should not emit when selected student is null');
    });
    component.pickAttendee(null);
  });

  it('pickAttendee should emit attendeePick when called with a selected student', () => {
    const fakeEvent = { source: { close: jasmine.createSpy() } };
    component.selectedStudent.setValue(students[0]);
    component.attendeePick.subscribe((attendee: LessonAttendee) => {
      expect(attendee).toEqual(Object.assign(new LessonAttendee, {
        studentId: students[0].id,
        student: students[0],
        hasAttended: false,
        hasPaid: false,
        price: 0
      }));
    });
    component.pickAttendee(fakeEvent);
    fixture.detectChanges();
    expect(component.selectedStudent.value).toBeNull();
    expect(fakeEvent.source.close).toHaveBeenCalled();
  });
});
