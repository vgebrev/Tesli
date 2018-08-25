import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MatTable } from '@angular/material/table';
import { LessonAttendee } from '../../../model/lesson-attendee';
import { LessonRateService } from '../../../services/lesson-rate.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'lesson-attendee-list',
  templateUrl: './lesson-attendee-list.component.html',
  styleUrls: ['./lesson-attendee-list.component.scss']
})
export class LessonAttendeeListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'hasAttended', 'hasPaid', 'price', 'action'];
  @Input() lessonId: number;
  @Input() lessonAttendees: LessonAttendee[];
  @ViewChild(MatTable) table: MatTable<any>;
  isLoading: boolean;
  constructor(private lessonRateService: LessonRateService, private notificationService: NotificationService) { }

  ngOnInit() {
  }

  removeAttendee(attendee: LessonAttendee) {
    const attendeeCount = this.lessonAttendees.length;
    const attendeeIndex = this.lessonAttendees.findIndex(a => a.student.id === attendee.student.id);
    if (attendeeIndex < 0) {
      return;
    }

    this.lessonAttendees.splice(attendeeIndex, 1);
    this.setPrices(attendeeCount);
    this.table.renderRows();
  }

  addAttendee(attendee: LessonAttendee) {
    if (this.lessonAttendees.find(a => a.student.id === attendee.student.id)) { return; }
    attendee.lessonId = this.lessonId;
    const attendeeCount = this.lessonAttendees.length;
    this.lessonAttendees.push(attendee);
    this.setPrices(attendeeCount);
    this.table.renderRows();
  }

  setPrices(previousAttendeeCount: number) {
    if (this.lessonAttendees.length === 0) { return; }
    this.isLoading = true;
    const now = new Date();
    const priceForPreviousAttendee$ = this.lessonRateService.getPrice$(now, Math.max(previousAttendeeCount, 1));
    const priceForCurrentAttendee$ = this.lessonRateService.getPrice$(now, this.lessonAttendees.length);
    forkJoin(priceForPreviousAttendee$, priceForCurrentAttendee$)
      .pipe(
        tap(() => this.isLoading = false),
        catchError(() => {
          this.isLoading = false;
          this.notificationService.notification$.next({
            message: 'Unable to set prices',
            action: 'Retry',
            config: { duration: 5000 },
            callback: () => this.setPrices(previousAttendeeCount)
          });
          return of([]);
        })
      )
      .subscribe((prices: Array<number>) => {
        if (prices.length !== 2) { return; }
        const PREVIOUS = 0;
        const CURRENT = 1;
        this.lessonAttendees.forEach((attendee) => {
          if ((attendee.price === 0 || attendee.price === prices[PREVIOUS]) && !attendee.hasPaid) {
            attendee.price = prices[CURRENT];
          }
        });
      });
  }
}
