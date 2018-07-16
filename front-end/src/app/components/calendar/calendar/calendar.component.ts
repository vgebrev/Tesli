import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { addHours, isSameMonth, isSameDay, parse, format } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { LessonEditorComponent } from '../lesson-editor/lesson-editor.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  hoverDay = null;
  view = 'month';
  viewDate: Date = new Date();
  activeDayIsOpen = true;
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [{
      title: 'An event',
      start: new Date(2018, 6, 8, 10, 0),
      end: addHours(new Date(2018, 6, 8, 10, 0), 1),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    }, {
      title: 'Today event',
      start: parse(format(this.viewDate, 'YYYY-MM-DD 15:00')),
      end: addHours(parse(format(this.viewDate, 'YYYY-MM-DD 15:00')), 1),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    }];

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.refresh.subscribe((newDate) => {
      this.viewDate = newDate;
      this.activeDayIsOpen = this.events.some((event) => isSameDay(event.start, this.viewDate) || isSameDay(event.end, this.viewDate));
    });
  }

  handleCellClick(evt, day) {
    if (evt.target.className.indexOf('cal-') >= 0) {
      this.selectDay(day);
    } else {
      this.addLesson(day);
    }
  }

  selectDay(day): void {
   const { date, events } = day;
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

  changeEventTimes({
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

  changeViewDate(newDate) {
    this.refresh.next(newDate);
  }

  addLesson(day) {
    const dialogRef = this.dialog.open(LessonEditorComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      console.log('TODO: add lesson logic');
    });
  }

  setHoverDay(day) {
    this.hoverDay = day;
  }

  clearHoverDay() {
    this.hoverDay = null;
  }

}
