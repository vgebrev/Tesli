import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { LessonAttendee } from '../../../model/lesson-attendee';
import { MatTable } from '@angular/material/table';
import { LessonRateService } from '../../../services/lesson-rate.service';
import { forkJoin, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'lesson-attendee-list',
  templateUrl: './lesson-attendee-list.component.html',
  styleUrls: ['./lesson-attendee-list.component.scss']
})
export class LessonAttendeeListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'hasAttended', 'hasPaid', 'price', 'action'];
  @Input() attendees: LessonAttendee[];
  @ViewChild(MatTable) table: MatTable<any>;
  isLoading: boolean;
  constructor(private lessonRateService: LessonRateService, private notificationService: NotificationService) { }

  ngOnInit() {
  }

  removeAttendee(attendee: LessonAttendee) {
    const attendeeCount = this.attendees.length;
    this.attendees = this.attendees.filter(a => a !== attendee);
    this.setPrices(attendeeCount);
    this.table.renderRows();
  }

  addAttendee(attendee: LessonAttendee) {
    if (this.attendees.find(a => a.student === attendee.student)) { return; }

    const attendeeCount = this.attendees.length;
    this.attendees.push(attendee);
    this.setPrices(attendeeCount);
    this.table.renderRows();
  }

  setPrices(previousAttendeeCount: number) {
    if (this.attendees.length === 0) { return; }
    this.isLoading = true;
    const now = new Date();
    const priceForPreviousAttendee$ = this.lessonRateService.getPrice$(now, Math.max(previousAttendeeCount, 1));
    const priceForCurrentAttendee$ = this.lessonRateService.getPrice$(now, this.attendees.length);
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
        this.attendees.forEach((attendee) => {
          if (attendee.price === 0 || attendee.price === prices[PREVIOUS]) {
            attendee.price = prices[CURRENT];
          }
        });
      });
  }
}
