import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonAttendeePickerComponent } from './lesson-attendee-picker.component';
import { LoadingIndicatorStubComponent } from '../../../../testing/loading-indicator.stub';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '../../../modules/app-material.module';
import { Student } from '../../../model/student';
import { of } from 'rxjs';
import { StudentService } from '../../../services/student.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
});
