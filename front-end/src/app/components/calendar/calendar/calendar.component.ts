import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarEventTitleFormatter } from 'angular-calendar';
import { DayViewHourSegment, MonthViewDay } from 'calendar-utils';
import { Subject, of, Observable, throwError } from 'rxjs';
import { addHours, isSameMonth, isSameDay, parse, format, getTime, startOfHour, setHours, startOfMinute, addDays } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { LessonEditorComponent } from '../../lesson/lesson-editor/lesson-editor.component';
import { environment } from '../../../../environments/environment';
import { LessonService } from '../../../services/lesson.service';
import { LessonTitleFormatter } from './lesson-title-formatter.provider';
import { tap, catchError } from 'rxjs/operators';
import { NotificationService } from '../../../services/notification.service';
import { Lesson } from '../../../model/lesson';
import { LessonRepeaterComponent } from '../../lesson/lesson-repeater/lesson-repeater.component';

function isMonthViewDay(object: any): object is MonthViewDay {
  return object.hasOwnProperty('events');
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [
    { provide: CalendarEventTitleFormatter, useClass: LessonTitleFormatter }
  ]
})
export class CalendarComponent implements OnInit {
  isLoading = false;
  hoverItem = null;
  view = 'month';
  viewDate: Date = new Date();
  activeDayIsOpen = false;
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];

  constructor(
    private lessonService: LessonService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    private lessonTitleFormatter: CalendarEventTitleFormatter
  ) { }

  ngOnInit() {
    this.refresh.subscribe((newDate) => {
      this.viewDate = newDate;
      this.activeDayIsOpen = this.events.some((event) => isSameDay(event.start, this.viewDate) || isSameDay(event.end, this.viewDate));
    });
    this.getLessons();
  }

  getLessons() {
    this.isLoading = true;
    this.lessonService.getLessons()
      .pipe(
        tap(() => this.isLoading = false),
        catchError(() => {
          this.isLoading = false;
          this.notificationService.notification$.next({
            message: 'Unable to load lessons',
            action: 'Retry',
            config: { duration: 5000 },
            callback: () => this.getLessons()
          });
          return of([]);
        })
      ).subscribe((lessons: Array<Lesson>) => {
        this.events = lessons
          .sort((a, b) => parse(a.date) > parse(b.date) ? 1 : -1)
          .map((lesson) => this.initEvent(lesson));
        this.refresh.next(new Date());
      });
  }

  initEvent(lesson) {
    return {
      title: 'Lesson Title',
      start: parse(format(lesson.date, `YYYY-MM-DD ${lesson.startTime}`)),
      end: parse(format(lesson.date, `YYYY-MM-DD ${lesson.endTime}`)),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      meta: lesson,
      actions: [{
        icon: 'edit',
        label: 'Edit',
        onClick: (evt) => { this.editLesson(evt.event); }
      }, {
        icon: 'autorenew',
        label: 'Repeat',
        onClick: (evt) => { this.repeatLesson(evt.event); }
      }, {
        icon: lesson.status === 'active' ? 'cancel' : 'restore',
        label: lesson.status === 'active' ? 'Cancel' : 'Restore',
        onClick: (evt) => { this.toggleLessonStatus(evt.event); }
      }]
    };
  }

  handleCalendarClick(evt, data: MonthViewDay|DayViewHourSegment) {
    if (evt.target.className.indexOf('cal-') === -1) {
      let date = data.date;
      if (isMonthViewDay(data)) {
        date = startOfHour(setHours(date, environment.defaultLessonStartHour));
      }
      this.addLesson(date);
    } else {
      if (isMonthViewDay(data)) {
        this.selectDay(data);
      }
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

    event.meta.date = newStart;
    event.meta.startTime = format(newStart, 'HH:mm');
    event.meta.endTime = format(newEnd, 'HH:mm');
    this.saveLesson(event.meta).subscribe(() => {
      this.isLoading = false;
      event.start = newStart;
      event.end = newEnd;
      // TODO: Figure out why UI only updates using title formatter when title changes
      event.title = this.lessonTitleFormatter.day(event, '');
      this.sortEvents();
      this.refresh.next(parse(format(newStart, 'YYYY-MM-DD')));
    }, this.handleSaveLessonError);
  }

  changeViewDate(newDate) {
    this.refresh.next(newDate);
  }

  addLesson(date: Date) {
    const startTime = startOfMinute(getTime(date));
    const lessonToAdd: Lesson = {
      id: 0,
      date: date,
      startTime: format(startTime, 'HH:mm'),
      endTime: format(addHours(startTime, 1), 'HH:mm'),
      lessonAttendees: [],
      status: 'active'
    };
    const event: any = this.initEvent(lessonToAdd);
    this.editLesson(event, true);
  }

  editLesson(event: CalendarEvent, isNew?: boolean) {
    const lessonToEdit = event.meta;
    const dialogRef = this.dialog.open(LessonEditorComponent, {
      autoFocus: false,
      data: lessonToEdit
    });
    dialogRef.afterClosed().subscribe(lesson => {
      if (!lesson) { return; }
      this.saveLesson(lesson).subscribe(() => {
        this.isLoading = false;
        event.meta = lesson;
        event.start = parse(format(lesson.date, `YYYY-MM-DD ${lesson.startTime}`)),
        event.end = parse(format(lesson.date, `YYYY-MM-DD ${lesson.endTime}`));
        event.title = this.lessonTitleFormatter.day(event, '');
        if (isNew) {
          this.events.push(event);
        }
        this.sortEvents();
        this.refresh.next(lesson.date);
      }, this.handleSaveLessonError);
    });
  }

  repeatLesson(event: CalendarEvent) {
    const dialogRef = this.dialog.open(LessonRepeaterComponent);
    dialogRef.afterClosed().subscribe(({repeatCount, repeatInterval}) => {
      const savedLesson$ = new Subject<number>();
      let savedCount = 0;
      savedLesson$.subscribe((count: number) => {
        if (count === repeatCount) {
          this.sortEvents();
          this.refresh.next(event.start);
        }
      });
      for (let index = 0; index < repeatCount; index++) {
        const lessonToRepeat = Object.assign({}, event.meta);
        lessonToRepeat.id = 0;
        lessonToRepeat.date = addDays(lessonToRepeat.date, (index + 1) * repeatInterval);
        lessonToRepeat.lessonAttendees = lessonToRepeat.lessonAttendees.map(originalAttendee => {
          const newAttendee = Object.assign({}, originalAttendee);
          newAttendee.id = 0;
          newAttendee.hasAttended = false;
          newAttendee.hasPaid = false;
          return newAttendee;
        });
        this.saveLesson(lessonToRepeat).subscribe(() => {
          this.isLoading = false;
          const repeatEvent = this.initEvent(lessonToRepeat);
          this.events.push(repeatEvent);
          savedLesson$.next(++savedCount);
        }, this.handleSaveLessonError);
      }


    });
  }

  toggleLessonStatus(event) {
    const lesson = event.meta;
    const CANCEL_ACTION = 2;
    const action = event.actions[CANCEL_ACTION];

    lesson.status = lesson.status === 'active' ? 'cancelled' : 'active';

    this.saveLesson(lesson).subscribe(() => {
      this.isLoading = false;
      if (lesson.status === 'cancelled') {
        action.icon = 'restore';
        action.label = 'Restore';
      } else {
        action.icon = 'cancel';
        action.label = 'Cancel';
      }
      event.title = this.lessonTitleFormatter.day(event, '');
      this.refresh.next(lesson.date);
    }, this.handleSaveLessonError);
  }

  saveLesson(lesson: Lesson): Observable<Lesson> {
    this.isLoading = true;
    const serviceAction = lesson.id ?
      this.lessonService.updateLesson(lesson) :
      this.lessonService.addLesson(lesson);
    return serviceAction;
  }

  handleSaveLessonError() {
    this.isLoading = false;
    this.notificationService.notification$.next({
      message: 'Unable to save lesson',
      action: 'Close',
      config: { duration: 5000 }
    });
  }

  sortEvents() {
    this.events = this.events.sort((a, b) => a.start > b.start ? 1 : -1);
  }

  setHoverItem(item) {
    this.hoverItem = item;
  }

  clearHoverItem() {
    this.hoverItem = null;
  }
}
