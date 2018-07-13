import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';

import { StudentsComponent } from './students.component';
import { Component, Input, DebugElement } from '@angular/core';
import { of, throwError, Observable } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '../../modules/app-material.module';
import { StudentService } from '../../services/student.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, Routes } from '@angular/router';
import { Location } from '@angular/common';
import { Student } from '../../models/student';
import { By } from '@angular/platform-browser';
import { NotificationService } from '../../services/notification.service';

@Component({selector: 'loading-indicator', template: ''})
class LoadingIndicatorStubComponent { @Input() isLoading: boolean; }

@Component({selector: 'app-student-detail', template: ''})
class StudentDetailStubComponent { }

describe('StudentsComponent', () => {
  let component: StudentsComponent;
  let fixture: ComponentFixture<StudentsComponent>;
  let debugElement: DebugElement;
  let router: Router;
  let location: Location;

  const students: Student[] = [
    { id: 1, name: 'First Student' },
    { id: 2, name: 'Second Learner' },
    { id: 3, name: 'Third Pupil' }
  ];

  const routes: Routes = [
    { path: 'students', component: StudentsComponent },
    { path: '', redirectTo: '/students', pathMatch: 'full' },
    { path: 'student/:id', component: StudentDetailStubComponent },
    { path: 'student', component: StudentDetailStubComponent },
  ];

  afterAll(() => {
    fixture.nativeElement.remove();
  });

  beforeEach(async(() => {
    const studentServiceSpy = createHeroServiceSpy();
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AppMaterialModule,
        RouterTestingModule.withRoutes(routes)
      ],
      declarations: [
        StudentsComponent,
        LoadingIndicatorStubComponent,
        StudentDetailStubComponent
      ],
      providers: [
        { provide: StudentService, useValue: studentServiceSpy },
      ]
    })
    .compileComponents();

    router = TestBed.get(Router);
    location = TestBed.get(Location);
    router.initialNavigation();
  }));

  function createHeroServiceSpy() {
    const studentServiceSpy = jasmine.createSpyObj('StudentService', ['getStudents', 'deleteStudent']);
    studentServiceSpy.getStudents.and.callFake(() => of(students));
    studentServiceSpy.deleteStudent.and.callFake(() => of({}));
    return studentServiceSpy;
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create and get students on init', inject([StudentService], (service: StudentService) => {
    expect(component).toBeTruthy();
    expect(service.getStudents).toHaveBeenCalled();
  }));

  it('should navigate to student-detail when showStudentDetail is called', fakeAsync(() => {
    const student = students[0];
    component.showStudentDetail(student);
    tick();
    expect(location.path()).toBe(`/student/${student.id}`);
  }));

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

  it('should remove a student when deleteStudent is called', inject([StudentService], (service: StudentService) => {
    const student = students[1];
    component.delete(student);

    expect(service.deleteStudent).toHaveBeenCalledWith(student);
    expect(component.students.length).toBe(2);
    expect(component.students.filter(s => s.id === student.id).length).toBe(0);
  }));

  it('should handle service deleteStudent errors', inject([StudentService], (service: StudentService) => {
    const erroringService = service as any;
    erroringService.deleteStudent.and.callFake(() => throwError('service error'));

    component.delete(component.students[0]);
    expect(component.students).toEqual(students);
  }));

  it('should send delete error notification and retry when the notification callback is invoked',
  async(inject([StudentService, NotificationService], (service: StudentService, notificationService: NotificationService) => {
    const studentToDelete = component.students[0];
    const erroringService = service as any;
    erroringService.deleteStudent.and.callFake(() => throwError('service error'));
    notificationService.notification$.subscribe((notification) => {
      expect(notification.message).toBe('Unable to delete student');
      expect(notification.action).toBe('Retry');
      expect(notification.config).toEqual({ duration: 5000});
      const retryDelete = spyOn(component, 'delete');
      notification.callback();
      expect(retryDelete).toHaveBeenCalledWith(studentToDelete);
    });
    component.delete(studentToDelete);
  })));

  it('should navigate to student-detail with no id when Add New Student is clicked', fakeAsync(() => {
    const addNewStudentLink = debugElement.queryAll(By.css('.action-container a'))[0];
    addNewStudentLink.nativeElement.click();
    tick();
    expect(location.path()).toBe('/student');
  }));

  it('should display all students in a talbe', () => {
    const tableElement = debugElement.query(By.css('.table-container table'));
    expect(tableElement.nativeElement.rows.length).toBe(students.length + 1);
  });

  it('should delete a student when the delete button of the table row is clicked',
  fakeAsync(inject([StudentService], (service: StudentService) => {
    const deleteButtonElements = debugElement.queryAll(By.css('.table-container button'));
    deleteButtonElements.forEach(buttonElement => {
      const index = deleteButtonElements.indexOf(buttonElement);
      const student = students[index];
      buttonElement.nativeElement.click();
      tick();
      expect(service.deleteStudent).toHaveBeenCalledWith(student);
      expect(component.students.length).toBe(students.length);
      expect(component.students.filter(s => s.id === student.id).length).toBe(0);
    });
  })));

  it('should navigate to student-detail when a table cell is clicked', fakeAsync(() => {
    tick();
    const table = debugElement.query(By.css('.table-container table'));
    const cells = table.nativeElement.querySelectorAll('td[id]');
    cells.forEach(cell => {
      const id = +cell.attributes['id'].value;
      cell.click();
      tick();
      expect(location.path()).toBe(`/student/${id}`);
      router.navigate(['students']);
      tick();
    });
  }));
});
