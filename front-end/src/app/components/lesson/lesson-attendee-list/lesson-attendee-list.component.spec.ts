import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '../../../modules/app-material.module';
import { FormsModule } from '@angular/forms';

import { LessonAttendeeListComponent } from './lesson-attendee-list.component';
import { Component, EventEmitter, Output } from '@angular/core';
import { LessonAttendee } from '../../../model/lesson-attendee';
import { LessonRateService } from '../../../services/lesson-rate.service';
import { NotificationService } from '../../../services/notification.service';
import { LoadingIndicatorStubComponent } from '../../../../testing/loading-indicator.stub';
import { of, throwError } from 'rxjs';
import { Lesson } from '../../../model/lesson';

@Component({ selector: 'lesson-attendee-picker', template: '' })
class LessonAttendeePickerStubComponent {
  @Output() attendeePick: EventEmitter<LessonAttendee> = new EventEmitter();
}

describe('LessonAttendeeListComponent', () => {
  let component: LessonAttendeeListComponent;
  let fixture: ComponentFixture<LessonAttendeeListComponent>;

  beforeEach(async(() => {
    const lessonRateServiceSpy = jasmine.createSpyObj<LessonRateService>(['getPrice$']);
    lessonRateServiceSpy.getPrice$.and.callFake((effectiveDate: Date, numberOfStudents: number) => of(numberOfStudents));
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AppMaterialModule,
        FormsModule
      ],
      declarations: [
        LessonAttendeeListComponent,
        LessonAttendeePickerStubComponent,
        LoadingIndicatorStubComponent
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
    component.lessonAttendees = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('removeAttendee should remove an attendee, set prices and render table rows', () => {
    const attendee: LessonAttendee = {
      id: 1,
      lessonId: 0,
      studentId: 1,
      student: { id: 1, name: 'test student' },
      hasAttended: false,
      hasPaid: false,
      price: 0
    };
    const setPricesSpy = spyOn(component, 'setPrices');
    const tableRenderRowsSpy = spyOn(component.table, 'renderRows');
    component.lessonAttendees.push(attendee);

    component.removeAttendee(attendee);
    expect(component.lessonAttendees.length).toBe(0);
    expect(setPricesSpy).toHaveBeenCalledWith(1);
    expect(tableRenderRowsSpy).toHaveBeenCalled();
  });

  it('addAttendee should add new attendee, set prices and render table rows', () => {
    const student = { id: 1, name: 'test student' };
    const setPricesSpy = spyOn(component, 'setPrices');
    const tableRenderRowsSpy = spyOn(component.table, 'renderRows');
    expect(component.lessonAttendees.length).toBe(0);

    component.addAttendee({
      id: 1,
      lessonId: 0,
      studentId: student.id,
      student: student,
      hasAttended: false,
      hasPaid: false,
      price: 0
    });
    expect(component.lessonAttendees.length).toBe(1);
    expect(setPricesSpy).toHaveBeenCalledWith(0);
    expect(tableRenderRowsSpy).toHaveBeenCalled();
  });

  it('addAttendee should return if student is already an attendee', () => {
    const student = { id: 1, name: 'test student' };
    const setPricesSpy = spyOn(component, 'setPrices');

    component.lessonAttendees.push({
      id: 1,
      lessonId: 0,
      studentId: student.id,
      student: student,
      hasAttended: false,
      hasPaid: false,
      price: 0
    });

    component.addAttendee({
      id: 1,
      lessonId: 0,
      studentId: student.id,
      student: student,
      hasAttended: false,
      hasPaid: false,
      price: 0
    });
    expect(component.lessonAttendees.length).toBe(1);
    expect(setPricesSpy).not.toHaveBeenCalled();
  });

  it('setPrices should return immediately when there are no attendees',
  inject([LessonRateService], (lessonRateService: LessonRateService) => {
    component.setPrices(1);
    expect(lessonRateService.getPrice$).not.toHaveBeenCalled();
  }));

  it('setPrices should set price to a new attendee',
  inject([LessonRateService], (lessonRateService: LessonRateService) => {
    component.lessonAttendees.push({
      id: 1,
      lessonId: 0,
      studentId: 1,
      student: { id: 1, name: 'test student' },
      hasAttended: false,
      hasPaid: false,
      price: 0
    });
    component.setPrices(0);
    expect(lessonRateService.getPrice$).toHaveBeenCalledTimes(2);
    expect(component.lessonAttendees[0].price).toBe(1);
  }));

  it('setPrices should update price on an attendee with an unchanged price',
  inject([LessonRateService], (lessonRateService: LessonRateService) => {
    component.lessonAttendees.push({
      id: 1,
      lessonId: 0,
      studentId: 1,
      student: { id: 1, name: 'test student' },
      hasAttended: false,
      hasPaid: false,
      price: 2
    });
    component.setPrices(2);
    expect(lessonRateService.getPrice$).toHaveBeenCalledTimes(2);
    expect(component.lessonAttendees[0].price).toBe(1);
  }));

  it('setPrices should not update price on an attendee with a changed price',
  inject([LessonRateService], (lessonRateService: LessonRateService) => {
    component.lessonAttendees.push({
      id: 1,
      lessonId: 0,
      studentId: 1,
      student: { id: 1, name: 'test student' },
      hasAttended: false,
      hasPaid: false,
      price: 3
    });
    component.setPrices(2);
    expect(lessonRateService.getPrice$).toHaveBeenCalledTimes(2);
    expect(component.lessonAttendees[0].price).toBe(3);
  }));

  it('should handle service getPrice$ errors',
  async(inject([LessonRateService, NotificationService], (service: LessonRateService, notificationService: NotificationService) => {
    const erroringService = service as any;
    erroringService.getPrice$.and.callFake(() => throwError('service error'));
    component.lessonAttendees.push({
      id: 1,
      lessonId: 0,
      studentId: 1,
      student: { id: 1, name: 'test student' },
      hasAttended: false,
      hasPaid: false,
      price: 2
    });

    notificationService.notification$.subscribe((notification) => {
      expect(notification.message).toBe('Unable to set prices');
      expect(notification.action).toBe('Retry');
      expect(notification.config).toEqual({ duration: 5000});
      const retrySetPrices = spyOn(component, 'setPrices');
      notification.callback();
      expect(retrySetPrices).toHaveBeenCalledWith(1);
    });
    component.setPrices(1);
  })));
});
