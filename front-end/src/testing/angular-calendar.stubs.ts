import { Directive, Input, Output, HostListener, EventEmitter, Pipe, PipeTransform, Component, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { CalendarEventTimesChangedEvent } from 'angular-calendar';

@Directive({ selector: '[mwlCalendarPreviousView]' })
export class CalendarPreviousViewStubDirective {
    @Input() view: string;
    @Input() viewDate: Date;
    @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
    @HostListener('click')
    onClick(): void {}
}

@Directive({ selector: '[mwlCalendarNextView]' })
export class CalendarNextViewStubDirective {
    @Input() view: string;
    @Input() viewDate: Date;
    @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
    @HostListener('click')
    onClick(): void {}
}

@Directive({ selector: '[mwlCalendarToday]' })
export class CalendarTodayStubDirective {
    @Input() viewDate: Date;
    @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
    @HostListener('click')
    onClick(): void { }
}

@Pipe({ name: 'calendarDate' })
export class CalendarDateStubPipe implements PipeTransform {
    transform(): string {
        return null;
    }
}

@Component({selector: 'mwl-calendar-month-view', template: ''})
export class CalendarMonthViewStubComponent {
  @Input() viewDate: Date;
  @Input() events = [];
  @Input() activeDayIsOpen = false;
  @Input() refresh: Subject<any>;
  @Input() cellTemplate: TemplateRef<any>;
  @Output()
  eventTimesChanged = new EventEmitter<CalendarEventTimesChangedEvent>();
}

@Component({selector: 'mwl-calendar-week-view', template: ''})
export class CalendarWeekViewStubComponent {
  @Input() viewDate: Date;
  @Input() events = [];
  @Input() refresh: Subject<any>;
  @Output()
  eventTimesChanged = new EventEmitter<CalendarEventTimesChangedEvent>();
}

@Component({selector: 'mwl-calendar-day-view', template: ''})
export class CalendarDayViewStubComponent {
  @Input() viewDate: Date;
  @Input() events = [];
  @Input() refresh: Subject<any>;
  @Input() hourSegments = 4;
  @Input() dayStartHour = 0;
  @Input() dayEndHour = 23;
  @Output()
  eventTimesChanged = new EventEmitter<CalendarEventTimesChangedEvent>();
}
