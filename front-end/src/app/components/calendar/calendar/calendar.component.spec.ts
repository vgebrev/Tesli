import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { CalendarComponent } from './calendar.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '../../../modules/app-material.module';
import {
  CalendarMonthViewStubComponent,
  CalendarWeekViewStubComponent,
  CalendarDayViewStubComponent
} from '../../../../testing/angular-calendar.stubs';
import { addDays, addHours, addMonths } from 'date-fns';

@Component({ selector: 'app-calendar-header', template: ''})
class CalendarHeaderStubComponent {
  @Input() view: string;
  @Input() viewDate: Date;
}

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AppMaterialModule
      ],
      declarations: [
        CalendarComponent,
        CalendarHeaderStubComponent,
        CalendarMonthViewStubComponent,
        CalendarWeekViewStubComponent,
        CalendarDayViewStubComponent
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
    const newStart = new Date();
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
});
