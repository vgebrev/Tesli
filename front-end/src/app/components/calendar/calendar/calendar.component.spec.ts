import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { CalendarComponent } from './calendar.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '../../../modules/app-material.module';
import { addDays, addHours, addMonths, parse, format, startOfHour, setHours, getTime, startOfMinute } from 'date-fns';
import { CalendarModule, DateAdapter, CalendarEventTitleFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { Subject, of, throwError } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LessonEditorComponent } from '../../lesson/lesson-editor/lesson-editor.component';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../../services/notification.service';
import { LessonService } from '../../../services/lesson.service';
import { lessons } from '../../../services/in-memory-data/lessons';
import { LoadingIndicatorStubComponent } from '../../../../testing/loading-indicator.stub';
import { Lesson } from '../../../model/lesson';
import { LessonTitleFormatter } from './lesson-title-formatter.provider';

@Component({ selector: 'app-calendar-header', template: ''})
class CalendarHeaderStubComponent {
  @Input() view: string;
  @Input() viewDate: Date;
}

class MatDialogRefMock {
  private dialogResult$: Subject<any>;
  constructor() {
    this.dialogResult$ = new Subject();
  }

  afterClosed() {
    return this.dialogResult$;
  }

  close(dialogResult?: any) {
    this.dialogResult$.next(dialogResult);
  }
}

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async(() => {
    const dialogRefMock = new MatDialogRefMock();
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.callFake(() => dialogRefMock);

    const lessonServiceSpy = jasmine.createSpyObj<LessonService>(['getLessons', 'addLesson', 'updateLesson']);
    lessonServiceSpy.getLessons.and.callFake(() => of(lessons));
    lessonServiceSpy.addLesson.and.callFake(() => of({}));
    lessonServiceSpy.updateLesson.and.callFake(() => of({}));

    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AppMaterialModule,
        CalendarModule.forRoot({
          provide: DateAdapter,
          useFactory: adapterFactory
        })
      ],
      declarations: [
        CalendarComponent,
        CalendarHeaderStubComponent,
        LoadingIndicatorStubComponent
      ],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: LessonService, useValue: lessonServiceSpy },
        { provide: CalendarEventTitleFormatter, useClass: LessonTitleFormatter }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should refresh with a new viewDate when changeViewDate is called', () => {
    const date = new Date();
    let refreshedDate: Date;
    component.refresh.subscribe((newDate) => refreshedDate = newDate);
    component.changeViewDate(date);
    expect(refreshedDate).toEqual(date);
  });

  it('should not update event or refresh if changeEventTimes is called with new start and end on different days', () => {
    const calendarEvent = component.events[0];
    const newStart = new Date();
    const newEnd = addDays(newStart, 1);
    let refreshed = false;

    component.refresh.subscribe(() => refreshed = true);
    component.changeEventTimes({ event: calendarEvent, newStart: newStart, newEnd: newEnd, type: undefined });

    expect(calendarEvent.start).not.toEqual(newStart);
    expect(calendarEvent.end).not.toEqual(newEnd);
    expect(refreshed).toBeFalsy();
  });

  it('should update event and refresh if changeEventTimes is called with new start and end on the same day',
  inject([LessonService], (lessonService) => {
    const calendarEvent = component.events[0];
    const newStart =  parse(format(new Date(), 'YYYY-MM-DD'));
    const newEnd = addHours(newStart, 1);
    let refreshed = false;

    component.refresh.subscribe(() => refreshed = true);
    component.changeEventTimes({ event: calendarEvent, newStart: newStart, newEnd: newEnd, type: undefined });

    expect(calendarEvent.start).toEqual(newStart);
    expect(calendarEvent.end).toEqual(newEnd);
    expect(refreshed).toBeTruthy();
    expect(lessonService.updateLesson).toHaveBeenCalledWith(calendarEvent.meta);
  }));

  it('should not toggle activeDayIsOpen when selectDay is called with a new month', () => {
    const viewDate = new Date();
    const newDate = addMonths(viewDate, 1);
    component.activeDayIsOpen = false;
    component.viewDate = viewDate;
    component.selectDay({ date: newDate, events: [] });

    expect(component.activeDayIsOpen).toBeFalsy();
    expect(component.viewDate).not.toEqual(newDate);
  });

  it('should set activeDayIsOpen to false when it is true and selectDay is called with the same date', () => {
    const viewDate = new Date();
    component.activeDayIsOpen = true;
    component.viewDate = viewDate;
    component.selectDay({ date: viewDate, events: [component.events[0]] });

    expect(component.activeDayIsOpen).toBeFalsy();
  });

  it('should set activeDayIsOpen to false when it is true and selectDay is called with a new day in the same month and no events',
  () => {
    const viewDate = new Date(2018, 6, 1);
    const newDate = addDays(viewDate, 1);
    component.activeDayIsOpen = true;
    component.viewDate = viewDate;
    component.selectDay({ date: newDate, events: [] });

    expect(component.activeDayIsOpen).toBeFalsy();
  });

  it('should set activeDayIsOpen to true when it is false and selectDay is called with a new day in the same month with events',
  () => {
    const viewDate = new Date(2018, 6, 1);
    const newDate = addDays(viewDate, 1);
    component.activeDayIsOpen = false;
    component.viewDate = viewDate;
    component.selectDay({ date: newDate, events: [component.events[0]] });

    expect(component.activeDayIsOpen).toBeTruthy();
    expect(component.viewDate).toEqual(newDate);
  });

  it('should open a lesson editor dialog when addLesson is called',
  async(inject([MatDialog, MatDialogRef], (dialogSpy: MatDialog, dialogRef: MatDialogRef<any>) => {
    const now = new Date();
    const startTime = format(getTime(startOfMinute(now)), 'HH:mm');
    const endTime = format(getTime(addHours(startOfMinute(now), 1)), 'HH:mm');
    const lesson: Lesson = {
      id: 0,
      date: now,
      startTime: startTime,
      endTime: endTime,
      lessonAttendees: [],
      status: 'active'
    };

    component.addLesson(now);
    expect(dialogSpy.open).toHaveBeenCalledWith(LessonEditorComponent, {
      autoFocus: false,
      data: lesson
    });
    dialogRef.afterClosed().subscribe((result) => expect(result).toBeTruthy());
    dialogRef.close(lesson);
  })));

  it('should set hoverItem to setHoverItem argument', () => {
    const day = { isFakeDay: true };
    component.setHoverItem(day);
    expect(component.hoverItem).toBe(day);
  });

  it('should set hoverItem to null when clearHoverItem is called', () => {
    const day = { isFakeDay: true };
    component.hoverItem = day;

    component.clearHoverItem();
    expect(component.hoverItem).toBeNull();
  });

  it('should call selectDay when handleCalendarClick is called with a target containing a class with cal- prefix and a day', () => {
    const selectDaySpy = spyOn(component, 'selectDay');
    const addLessonSpy = spyOn(component, 'addLesson');
    const day = {
      inMonth: true,
      events: [],
      badgeTotal: 0,
      date: new Date(),
      isPast: true,
      isToday: true,
      isFuture: false,
      isWeekend: true
    };
    const evt = { target: { className: 'cal-cell-top' } };

    component.handleCalendarClick(evt, day);
    expect(selectDaySpy).toHaveBeenCalledWith(day);
    expect(addLessonSpy).not.toHaveBeenCalled();
  });

  it('should call addLesson when handleCalendarClick is called with a target containing a class without cal- prefix and a day', () => {
    const selectDaySpy = spyOn(component, 'selectDay');
    const addLessonSpy = spyOn(component, 'addLesson');
    const day = {
      inMonth: true,
      events: [],
      badgeTotal: 0,
      date: new Date(),
      isPast: true,
      isToday: true,
      isFuture: false,
      isWeekend: true
    };
    const evt = { target: { className: 'icon-button--shake' } };

    component.handleCalendarClick(evt, day);
    expect(addLessonSpy).toHaveBeenCalledWith(startOfHour(setHours(day.date, environment.defaultLessonStartHour)));
    expect(selectDaySpy).not.toHaveBeenCalled();
  });

  it('should do nothing when handleCalendarClick is called with a target containing a class with cal- prefix and a segment', () => {
    const selectDaySpy = spyOn(component, 'selectDay');
    const addLessonSpy = spyOn(component, 'addLesson');
    const segment = {
      isStart: true,
      date: new Date()
    };
    const evt = { target: { className: 'cal-hour-segment' } };

    component.handleCalendarClick(evt, segment);
    expect(addLessonSpy).not.toHaveBeenCalled();
    expect(selectDaySpy).not.toHaveBeenCalled();
  });

  it('should call addLesson when handleCalendarClick is called with a target containing a class without cal- prefix and a segment', () => {
    const selectDaySpy = spyOn(component, 'selectDay');
    const addLessonSpy = spyOn(component, 'addLesson');
    const segment = {
      date: new Date(),
      isStart: false
    };
    const evt = { target: { className: 'icon-button--shake' } };

    component.handleCalendarClick(evt, segment);
    expect(addLessonSpy).toHaveBeenCalledWith(segment.date);
    expect(selectDaySpy).not.toHaveBeenCalled();
  });

  it('lesson title formatter day tooltip is blank',
    inject([CalendarEventTitleFormatter], (lessonTitleFormatter: CalendarEventTitleFormatter) => {
    expect(lessonTitleFormatter.dayTooltip({ start: new Date(), title: 'Mock Event'}, '')).toBeFalsy();
  }));

  it('should send notification when handleSaveLessonError is called',
    async(inject([NotificationService], (notificationService: NotificationService) => {
      notificationService.notification$.subscribe((notification) => {
        expect(notification.message).toBe('Unable to save lesson');
        expect(notification.action).toBe('Close');
        expect(notification.config).toEqual({ duration: 5000 });
      });
      component.handleSaveLessonError();
    }))
  );

  it('saveLesson should throw error when the service errors',
    async(inject([LessonService], (service: LessonService) => {
      const erroringService = service as any;
      erroringService.updateLesson.and.callFake(() => throwError('service error'));

      component.saveLesson(lessons[0]).subscribe(
        (result) => { expect(result).toBeFalsy(); },
        (error) => { expect(error).toBe('service error'); });
    })
  ));

  it('getLessons should send notification when lesson service errors',
    async(inject([LessonService, NotificationService], (service: LessonService, notificationService: NotificationService) => {
      const erroringService = service as any;
      erroringService.getLessons.and.callFake(() => throwError('service error'));

      notificationService.notification$.subscribe((notification) => {
        expect(notification.message).toBe('Unable to load lessons');
        expect(notification.action).toBe('Retry');
        expect(notification.config).toEqual({ duration: 5000 });
        const retryGetLessons = spyOn(component, 'getLessons');
        notification.callback();
        expect(retryGetLessons).toHaveBeenCalled();
      });
      component.getLessons();
    })
  ));

  it('initEvent should initialise event with edit action that invokes editLesson', () => {
    const editLessonSpy = spyOn(component, 'editLesson');
    const event = component.initEvent(lessons[0]);
    event.actions[0].onClick({ event: event });
    expect(editLessonSpy).toHaveBeenCalledWith(event);
  });

  it('initEvent should initialise event with repeat action that invokes repeatLesson', () => {
    const repeatLessonSpy = spyOn(component, 'repeatLesson');
    const event = component.initEvent(lessons[0]);
    event.actions[1].onClick({ event: event });
    expect(repeatLessonSpy).toHaveBeenCalledWith(event);
  });

  it('initEvent should initialise event with cancel action that invokes toggleLessonStatus', () => {
    const toggleLessonStatusSpy = spyOn(component, 'toggleLessonStatus');
    const event = component.initEvent(lessons[0]);
    event.actions[2].onClick({ event: event });
    expect(toggleLessonStatusSpy).toHaveBeenCalledWith(event);
  });

  it('should not do anything when the lesson editor dialog is cancelled',
  async(inject([MatDialog, MatDialogRef], (dialogSpy: MatDialog, dialogRef: MatDialogRef<any>) => {
    const event = component.initEvent(lessons[0]);
    const saveLessonSpy = spyOn(component, 'saveLesson');
    component.editLesson(event, false);
    expect(dialogSpy.open).toHaveBeenCalledWith(LessonEditorComponent, {
      autoFocus: false,
      data: lessons[0]
    });
    dialogRef.afterClosed().subscribe((result) => {
      expect(result).toBeFalsy();
      expect(saveLessonSpy).not.toHaveBeenCalled();
    });
    dialogRef.close(null);
  })));

  it('editLesson should not add existing events to the components events array',
  async(inject([MatDialogRef], (dialogRef: MatDialogRef<any>) => {
    const eventsLength = component.events.length;
    const event = component.initEvent(lessons[0]);
    component.editLesson(event, false);
    dialogRef.close(lessons[0]);
    fixture.detectChanges();
    expect(component.events.length).toBe(eventsLength);
  })));

  it('should change status and action when toggleLessonStatus is called',
  async(() => {
    const event = component.events[0];
    event.meta.status = 'active';
    component.toggleLessonStatus(event);
    fixture.detectChanges();
    expect(event.meta.status).toBe('cancelled');
    expect((event.actions[2] as any).icon).toBe('restore');
    expect(event.actions[2].label).toBe('Restore');

    component.toggleLessonStatus(event);
    fixture.detectChanges();
    expect(event.meta.status).toBe('active');
    expect((event.actions[2] as any).icon).toBe('cancel');
    expect(event.actions[2].label).toBe('Cancel');
  }));

  it('should create and save new lessons, add new events, sort and refresh when a repeatLesson is called',
  async(inject([MatDialogRef], (dialogRef: MatDialogRef<any>) => {
    const originalEventsLength = component.events.length;
    const sortEventsSpy = spyOn(component, 'sortEvents');
    component.repeatLesson(component.events[0]);
    dialogRef.close({ repeatCount: 2, repeatInterval: 100 });
    fixture.detectChanges();
    const newEventsLength = component.events.length;
    expect(newEventsLength).toBe(originalEventsLength + 2);
    expect(component.events[newEventsLength - 1].start).toEqual(addDays(component.events[0].start, 200));
    expect(component.events[newEventsLength - 2].start).toEqual(addDays(component.events[0].start, 100));
    expect(sortEventsSpy).toHaveBeenCalled();
  })));
});
