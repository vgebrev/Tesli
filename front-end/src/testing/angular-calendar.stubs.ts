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
