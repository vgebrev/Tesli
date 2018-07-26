import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '../../../modules/app-material.module';
import { ActivatedRouteStub } from '../../../../testing/activated-route.stub';
import { StudentDetailComponent } from './student-detail.component';
import { DebugElement } from '@angular/core';
import { Location } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NotificationService } from '../../../services/notification.service';
import { LoadingIndicatorStubComponent } from '../../../../testing/loading-indicator.stub';

describe('StudentDetailComponent', () => {
  let component: StudentDetailComponent;
  let fixture: ComponentFixture<StudentDetailComponent>;
  let debugElement: DebugElement;
  let activatedRoute: ActivatedRouteStub;
  const testStudent = {
    id: 1,
    name: 'Test Student',
    grade: 10,
    school: 'Some school',
    contactNumber: null,
    email: 'test@domain.com',
    goals: null,
    parentName: 'Heli Copter',
    address: null,
    parentContactNumber: '1234567890',
    parentEmail: null
  };

  beforeEach(async(() => {
    const studentServiceSpy = createStudentServiceSpy();
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    activatedRoute = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AppMaterialModule,
        ReactiveFormsModule,
        FormsModule ],
      declarations: [
        StudentDetailComponent,
        LoadingIndicatorStubComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: StudentService, useValue: studentServiceSpy },
        { provide: Location, useValue: locationSpy }
      ]
    })
    .compileComponents();
  }));

  function createStudentServiceSpy() {
    const studentServiceSpy = jasmine.createSpyObj('StudentService', ['getStudent', 'updateStudent', 'addStudent']);
    studentServiceSpy.getStudent.and.callFake(() => of(testStudent));
    studentServiceSpy.addStudent.and.callFake(() => of({}));
    studentServiceSpy.updateStudent.and.callFake(() => of({}));

    return studentServiceSpy;
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.studentForm.value).toEqual({
      id: 0,
      name: '',
      grade: null,
      school: null,
      contactNumber: null,
      email: null,
      goals: null,
      parentName: null,
      address: null,
      parentContactNumber: null,
      parentEmail: null
    });
    expect(component.studentForm.pristine).toBeTruthy();
  });

  it('should go back when goBack is called', inject([Location], (location: Location) => {
      component.goBack();
      expect(location.back).toHaveBeenCalledTimes(1);
  }));

  it('should call goBack when the Cancel button is clicked', inject([Location], (location: Location) => {
    const button = debugElement.query(By.css('button[type="button"]'));
    expect(button.nativeElement.textContent).toBe('Cancel', 'Cancel button not found');
    button.triggerEventHandler('click', null);
    expect(location.back).toHaveBeenCalledTimes(1);
  }));

  it('should not get a student when routed to without an id', inject([StudentService], (service: StudentService) => {
    expect(service.getStudent).not.toHaveBeenCalled();
  }));

  it('should get a student when routed to with an id', fakeAsync(inject([StudentService], (service: StudentService) => {
      activatedRoute.setParamMap({id: 1});
      tick();
      expect(service.getStudent).toHaveBeenCalledWith(1);
      expect(component.studentForm.value).toEqual(testStudent);
  })));

  it('should not save when form is invalid', () => {
    expect(component.studentForm.valid).toBeFalsy();
    expect(component.save()).toBeFalsy();
  });

  it('should disable the Save button when form is pristine or invalid', () => {
    const saveButton = debugElement.query(By.css('button[type="submit"]'));
    expect(saveButton.nativeElement.disabled).toBeTruthy();
    component.studentForm.setValue(testStudent);
    component.studentForm.markAsDirty();
    fixture.detectChanges();
    expect(saveButton.nativeElement.disabled).toBeFalsy();
  });

  it('should call save when the form is submitted', inject([StudentService, Location], (service: StudentService, location: Location) => {
    const updatedStudent = Object.assign({}, testStudent);
    updatedStudent.name = 'Updated Student';
    const formElement = debugElement.query(By.css('.student-detail-form'));
    activatedRoute.setParamMap({id: 1});
    component.studentForm.controls['name'].setValue('Updated Student');
    formElement.triggerEventHandler('ngSubmit', null);
    expect(service.updateStudent).toHaveBeenCalledWith(updatedStudent);
    expect(location.back).toHaveBeenCalled();
  }));

  it('should add a student when id is not set', inject([StudentService, Location], (service: StudentService, location: Location) => {
      const newStudent = Object.assign({}, testStudent);
      newStudent.id = null;
      component.studentForm.setValue(newStudent);
      expect(component.save()).toBeTruthy();
      expect(service.addStudent).toHaveBeenCalledWith(newStudent);
      expect(location.back).toHaveBeenCalled();
  }));

  it('should update a student when id is set', inject([StudentService, Location], (service: StudentService, location: Location) => {
    const updatedStudent = Object.assign({}, testStudent);
    activatedRoute.setParamMap({id: 1});
    fixture.detectChanges();
    component.studentForm.setValue(updatedStudent);
    expect(component.save()).toBeTruthy();
    expect(service.updateStudent).toHaveBeenCalledWith(updatedStudent);
    expect(location.back).toHaveBeenCalled();
  }));

  it('should send getStudent error notification and retry when the notification callback is invoked',
  async(inject([StudentService, NotificationService], (service: StudentService, notificationService: NotificationService) => {
    const erroringService = service as any;
    erroringService.getStudent.and.callFake(() => throwError('service error'));
    notificationService.notification$.subscribe((notification) => {
      expect(notification.message).toBe('Unable to load student');
      expect(notification.action).toBe('Retry');
      expect(notification.config).toEqual({ duration: 5000});
      const retryGetStudent = spyOn(component, 'getStudent');
      notification.callback();
      expect(retryGetStudent).toHaveBeenCalled();
    });
    activatedRoute.setParamMap({id: 1});
    fixture.detectChanges();
    component.getStudent();
  })));

  it('should send save error notification and retry when the notification callback is invoked',
  async(inject([StudentService, NotificationService], (service: StudentService, notificationService: NotificationService) => {
    const erroringService = service as any;
    erroringService.addStudent.and.callFake(() => throwError('service error'));

    const newStudent = Object.assign({}, testStudent);
    newStudent.id = null;
    component.studentForm.setValue(newStudent);

    notificationService.notification$.subscribe((notification) => {
      expect(notification.message).toBe('Unable to save student');
      expect(notification.action).toBe('Retry');
      expect(notification.config).toEqual({ duration: 5000});
      const retrySave = spyOn(component, 'save');
      notification.callback();
      expect(retrySave).toHaveBeenCalled();
    });
    fixture.detectChanges();
    component.save();
  })));
});
