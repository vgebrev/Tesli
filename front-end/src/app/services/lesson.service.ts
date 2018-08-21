import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Lesson } from '../model/lesson';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private lessonsUrl = `${environment.apiUrl}/lesson`;

  constructor(private http: HttpClient) { }

  // TODO: Date filter
  getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(this.lessonsUrl, httpOptions).pipe(
      catchError((error) => throwError(error))
    );
  }

  updateLesson(lesson: Lesson): Observable<Lesson> {
    return this.http.put<Lesson>(this.lessonsUrl, lesson, httpOptions).pipe(
      catchError((error) => throwError(error))
    );
  }

  addLesson(lesson: Lesson): Observable<Lesson> {
    return this.http.post<Lesson>(this.lessonsUrl, lesson, httpOptions).pipe(
      catchError((error) => throwError(error))
    );
  }
}
