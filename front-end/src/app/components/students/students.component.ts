import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Student } from '../../models/student';
import { StudentService } from '../../services/student.service';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'school', 'grade', 'action'];
  students: Student[] = [];
  isLoading = true;

  constructor(private studentService: StudentService, private router: Router, private notificationService: NotificationService) { }

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
          return of([]) 
        })
      ).subscribe(students => this.students = students);
  }

  delete(student: Student): void {
    let isInErrorState = false;
    this.isLoading = true;
    this.studentService.deleteStudent(student)
      .pipe(
        tap(() => this.isLoading = false),
        catchError(() => { 
          this.isLoading = false; 
          isInErrorState = true; 
          this.notificationService.notification$.next({
            message: 'Unable to delete student', 
            action: 'Retry',
            config: { duration: 5000 },
            callback: () => this.delete(student)
          });
          return of({}) 
        }),
      ).subscribe(() => {
        //TODO: I don't think this is the correct way to prevent student removal on error. Learn some RxJS
        if (!isInErrorState) {
          this.students = this.students.filter(s => s !== student)
        }
      }); 

      
  }

  showStudentDetail(student: Student) {
    this.router.navigateByUrl(`/student/${student.id}`);
  }
}