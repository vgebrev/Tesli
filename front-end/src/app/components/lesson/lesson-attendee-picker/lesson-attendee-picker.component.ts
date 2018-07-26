import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { Student } from '../../../model/student';
import { StudentService } from '../../../services/student.service';
import { NotificationService } from '../../../services/notification.service';
import { LessonAttendee } from '../../../model/lesson-attendee';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'lesson-attendee-picker',
  templateUrl: './lesson-attendee-picker.component.html',
  styleUrls: ['./lesson-attendee-picker.component.scss']
})
export class LessonAttendeePickerComponent implements OnInit {
  isLoading: boolean;
  students: Student[];
  selectedStudent = new FormControl();
  @Output() attendeePick: EventEmitter<LessonAttendee> = new EventEmitter();

  constructor(private studentService: StudentService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.getStudents();
  }

  getStudents(): void {
    this.isLoading = true;
    this.studentService.getStudents()
      .pipe(
        tap(() => this.isLoading = false),
        catchError(() => {
          this.isLoading = false;
          this.notificationService.notification$.next({
            message: 'Unable to load students',
            action: 'Retry',
            config: { duration: 5000 },
            callback: () => this.getStudents()
          });
          return of([]);
        })
      ).subscribe(students => this.students = students);
  }

  pickAttendee(event): void {
    if (this.selectedStudent.value) {
      this.attendeePick.emit(Object.assign(new LessonAttendee(), {
        student: this.selectedStudent.value,
        hasAttended: false,
        hasPaid: false,
        price: 0
      }));
      this.selectedStudent.setValue(null);
      event.source.close();
    }
  }
}
