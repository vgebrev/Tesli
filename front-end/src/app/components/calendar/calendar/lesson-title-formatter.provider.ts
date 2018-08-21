import { LOCALE_ID, Inject } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { Lesson } from '../../../model/lesson';

export class LessonTitleFormatter extends CalendarEventTitleFormatter {
  constructor(@Inject(LOCALE_ID) private locale: string) {
    super();
  }

  month(event: CalendarEvent): string {
    return this.statusQualifier(event.meta, `${this.duration(event.start, event.end)}: ${this.studentNames(event.meta)}`);
  }

  monthTooltip(event: CalendarEvent): string {
    return;
  }

  day(event: CalendarEvent): string {
    return this.statusQualifier(event.meta, `${this.duration(event.start, event.end)} ${this.studentsList(event.meta)}`);
  }

  dayTooltip(event: CalendarEvent): string {
    return;
  }

  duration(start: Date, end: Date) {
    return `${this.time(start)} - ${this.time(end)}`;
  }

  time(time: Date): string {
    return `<b>${new DatePipe(this.locale).transform(time, 'h:mm a', this.locale)}</b>`;
  }

  statusQualifier(lesson: Lesson, innerHtml: string) {
    return `<span class="lesson-${lesson.status}">${innerHtml}</span>`;
  }

  studentsList(lesson: Lesson) {
    return `<ul>${lesson.lessonAttendees
      .map(attendee => `<li>${attendee.student.name}</li>`)
      .join('')}</ul>`;
  }

  studentNames(lesson: Lesson) {
    return lesson.lessonAttendees
      .map(attendee => attendee.student.name)
      .join(', ');
  }
}
