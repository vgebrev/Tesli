import { Component, OnInit, Input } from '@angular/core';
import { LessonAttendee } from '../../../model/lesson-attendee';

@Component({
  selector: 'lesson-attendee-list',
  templateUrl: './lesson-attendee-list.component.html',
  styleUrls: ['./lesson-attendee-list.component.scss']
})
export class LessonAttendeeListComponent implements OnInit {

  @Input() attendees: LessonAttendee[];

  constructor() { }

  ngOnInit() {
  }

  removeAttendee(attendee: LessonAttendee) {
    this.attendees = this.attendees.filter(a => a !== attendee);
  }

  updateAttendee(attendee: LessonAttendee, newAttendee: LessonAttendee) {
    Object.assign(attendee, newAttendee);
  }

  addAttendee(attendee: LessonAttendee) {
    if (!this.attendees.find(a => a.student === attendee.student)) {
      this.attendees.push(attendee);
    }
  }
}
