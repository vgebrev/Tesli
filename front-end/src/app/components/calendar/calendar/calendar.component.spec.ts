import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { CalendarComponent } from './calendar.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '../../../modules/app-material.module';
import { addDays, addHours, addMonths, parse, format, startOfHour, setHours, getTime, startOfMinute } from 'date-fns';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { Subject, of } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LessonEditorComponent } from '../../lesson/lesson-editor/lesson-editor.component';
import { environment } from '../../../../environments/environment';
import { LessonService } from '../../../services/lesson.service';
import { lessons } from '../../../services/in-memory-data/lessons';

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

    const lessonServiceSpy = jasmine.createSpyObj<LessonService>(['getLessons']);
    lessonServiceSpy.getLessons.and.callFake(() => of(lessons));
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
        CalendarHeaderStubComponent
      ],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: LessonService, useValue: lessonServiceSpy }
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

  it('should update event and refresh if changeEventTimes is called with new start and end on the same day', () => {
    const calendarEvent = component.events[0];
    const newStart =  parse(format(new Date(), 'YYYY-MM-DD'));
    const newEnd = addHours(newStart, 1);
    let refreshed = false;

    component.refresh.subscribe(() => refreshed = true);
    component.changeEventTimes({ event: calendarEvent, newStart: newStart, newEnd: newEnd, type: undefined });

    expect(calendarEvent.start).toEqual(newStart);
    expect(calendarEvent.end).toEqual(newEnd);
    expect(refreshed).toBeTruthy();
  });

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
    const viewDate = new Date();
    const newDate = addDays(viewDate, 1);
    component.activeDayIsOpen = true;
    component.viewDate = viewDate;
    component.selectDay({ date: newDate, events: [] });

    expect(component.activeDayIsOpen).toBeFalsy();
  });

  it('should set activeDayIsOpen to true when it is false and selectDay is called with a new day in the same month with events',
  () => {
    const viewDate = new Date();
    const newDate = addDays(viewDate, 1);
    component.activeDayIsOpen = false;
    component.viewDate = viewDate;
    component.selectDay({ date: newDate, events: [component.events[0]] });

    expect(component.activeDayIsOpen).toBeTruthy();
    expect(component.viewDate).toEqual(newDate);
  });

  it('should open a lesson editor dialog when addLesson is called',
  inject([MatDialog, MatDialogRef], (dialogSpy: MatDialog, dialogRef: MatDialogRef<any>) => {
    const now = new Date();
    const startTime = format(getTime(startOfMinute(now)), 'HH:mm');
    const endTime = format(getTime(addHours(startOfMinute(now), 1)), 'HH:mm');

    component.addLesson(now);
    expect(dialogSpy.open).toHaveBeenCalledWith(LessonEditorComponent, {
      autoFocus: false,
      data: {
        date: now,
        startTime: startTime,
        endTime: endTime,
        attendees: [],
        status: 'active'
      }
    });
    dialogRef.afterClosed().subscribe((result) => expect(result).toBeTruthy());
    dialogRef.close(true);
  }));

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
});
