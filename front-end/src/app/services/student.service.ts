import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Student } from '../model/student';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private studentsUrl = `${environment.apiUrl}/student`;

  constructor(private http: HttpClient) { }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.studentsUrl).pipe(
      catchError(this.handleError<Student[]>('getStudents')));
  }

  getStudent(id: number): Observable<Student> {
    const url = `${this.studentsUrl}/${id}`;
    return this.http.get<Student>(url).pipe(
      catchError(this.handleError<Student>(`getStudent id=${id}`))
    );
  }

  updateStudent(student: Student): Observable<any> {
    return this.http.put(`${this.studentsUrl}/${student.id}`, student, httpOptions).pipe(
      catchError(this.handleError<any>('updateStudent'))
    );
  }

  addStudent (student: Student): Observable<Student> {
    return this.http.post<Student>(this.studentsUrl, student, httpOptions).pipe(
      catchError(this.handleError<Student>('addStudent'))
    );
  }

  deleteStudent (student: Student | number): Observable<Student> {
    const id = typeof student === 'number' ? student : student.id;
    const url = `${this.studentsUrl}/${id}`;

    return this.http.delete<Student>(url, httpOptions).pipe(
      catchError(this.handleError<Student>('deleteStudent'))
    );
  }

  private handleError<T> (operation: string) {
    return (error: any): Observable<T> => {
      console.log(`${operation} error:`);
      console.error(error);
      return throwError(error);
    };
  }
}
