import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { addHours, isSameMonth, isSameDay, parse, format } from 'date-fns';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  view = 'month';
  viewDate: Date = new Date();
  activeDayIsOpen = true;
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [
    {
      title: 'An event',
      start: new Date(2018, 6, 8, 10, 0),
      end: addHours(new Date(2018, 6, 8, 10, 0), 1),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    },
    {
      title: 'Today event',
      start: parse(format(this.viewDate, 'YYYY-MM-DD 15:00')),
      end: addHours(parse(format(this.viewDate, 'YYYY-MM-DD 15:00')), 1),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    }
  ];

  constructor() { }

  ngOnInit() {
    this.refresh.subscribe((newDate) => {
      this.viewDate = newDate;
      this.activeDayIsOpen = this.events.some((event) => isSameDay(event.start, this.viewDate) || isSameDay(event.end, this.viewDate));
    });
  }

  onDayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (!isSameMonth(date, this.viewDate)) {
      return;
    }

    if (
      (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
      events.length === 0
    ) {
      this.activeDayIsOpen = false;
    } else {
      this.activeDayIsOpen = true;
      this.viewDate = date;
    }
  }

  onEventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    if (!isSameDay(newStart, newEnd)) {
      return;
    }
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next(parse(format(newStart, 'YYYY-MM-DD')));
  }

  onViewDateChanged(newDate) {
    this.refresh.next(newDate);
  }
}
