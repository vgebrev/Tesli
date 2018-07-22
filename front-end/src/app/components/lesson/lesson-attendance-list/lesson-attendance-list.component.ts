import { Component, OnInit, Input } from '@angular/core';
import { LessonAttendee } from '../../../model/lesson-attendee';

@Component({
  selector: 'lesson-attendance-list',
  templateUrl: './lesson-attendance-list.component.html',
  styleUrls: ['./lesson-attendance-list.component.scss']
})
export class LessonAttendanceListComponent implements OnInit {

  @Input() attendees: LessonAttendee[];

  constructor() { }

  ngOnInit() {
  }

}
