import { Directive, Input, Output, HostListener, EventEmitter, Pipe, PipeTransform } from '@angular/core';

@Directive({ selector: '[mwlCalendarPreviousView]' })
export class CalendarPreviousViewDirectiveStub {
    @Input() view: string;
    @Input() viewDate: Date;
    @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
    @HostListener('click')
    onClick(): void {}
}

@Directive({ selector: '[mwlCalendarNextView]' })
export class CalendarNextViewDirectiveStub {
    @Input() view: string;
    @Input() viewDate: Date;
    @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
    @HostListener('click')
    onClick(): void {}
}

@Directive({ selector: '[mwlCalendarToday]' })
export class CalendarTodayDirectiveStub {
    @Input() viewDate: Date;
    @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
    @HostListener('click')
    onClick(): void { }
}

@Pipe({ name: 'calendarDate' })
export class CalendarDatePipeStub implements PipeTransform {
    transform(): string {
        return null;
    }
}