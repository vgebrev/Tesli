import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Student } from '../../../model/student';
import { LessonAttendee } from '../../../model/lesson-attendee';

@Component({
  selector: 'lesson-attendee-detail',
  templateUrl: './lesson-attendee-detail.component.html',
  styleUrls: ['./lesson-attendee-detail.component.scss']
})
export class LessonAttendeeDetailComponent implements OnInit {

  @Input() student: Student;
  @Input() hasAttended: boolean;
  @Input() hasPaid: boolean;
  @Input() price: number;
  @Output() remove: EventEmitter<void> = new EventEmitter();
  @Output() update: EventEmitter<LessonAttendee> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
