import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { LessonAttendee } from '../../../model/lesson-attendee';
import { MatTable } from '@angular/material/table';
import { LessonRateService } from '../../../services/lesson-rate.service';

@Component({
  selector: 'lesson-attendee-list',
  templateUrl: './lesson-attendee-list.component.html',
  styleUrls: ['./lesson-attendee-list.component.scss']
})
export class LessonAttendeeListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'hasAttended', 'hasPaid', 'price', 'action'];
  @Input() attendees: LessonAttendee[];
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private lessonRateService: LessonRateService) { }

  ngOnInit() {
  }

  removeAttendee(attendee: LessonAttendee) {
    const attendeeCount = this.attendees.length;
    this.attendees = this.attendees.filter(a => a !== attendee);
    this.setPrices(attendeeCount);
    this.table.renderRows();
  }

  addAttendee(attendee: LessonAttendee) {
    if (!this.attendees.find(a => a.student === attendee.student)) {
      const attendeeCount = this.attendees.length;
      this.attendees.push(attendee);
      this.setPrices(attendeeCount);
      this.table.renderRows();
    }
  }

  setPrices(previousAttendeeCount: number) {
    if (this.attendees.length === 0) { return; }
    const now = new Date();
    const priceForPreviousAttendeeCount = this.lessonRateService.getPrice(now, Math.max(previousAttendeeCount, 1));
    const priceForCurrentAttendeeCount = this.lessonRateService.getPrice(now, this.attendees.length);
    this.attendees.forEach(attendee => {
      if (attendee.price === 0 || attendee.price === priceForPreviousAttendeeCount) {
        attendee.price = priceForCurrentAttendeeCount;
      }
    });
  }
}
