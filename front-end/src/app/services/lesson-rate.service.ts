import { Injectable } from '@angular/core';
import { LessonRate } from '../model/lesson-rate';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError, of, Subject, Observer } from 'rxjs';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class LessonRateService {
  private lessonRatesUrl = `${environment.apiUrl}/lessonRate`;
  private lessonRates: LessonRate[];

  constructor(private http: HttpClient) { }

  getLessonRates(): Observable<LessonRate[]> {
    return this.http.get<LessonRate[]>(this.lessonRatesUrl, httpOptions).pipe(
      catchError((error) => throwError(error))
    );
  }

  getPrice$(effectiveDate: Date, numberOfStudents: number): Observable<number> {
    const price$ = Observable.create((observer: Observer<number>) => {
      if (this.lessonRates) {
        observer.next(this.getPrice(effectiveDate, numberOfStudents));
        observer.complete();
      } else {
        this.getLessonRates().subscribe((lessonRates) => {
          this.lessonRates = lessonRates.map((lessonRate) => ({
            effectiveDate: new Date(lessonRate.effectiveDate),
            numberOfStudents: lessonRate.numberOfStudents,
            price: lessonRate.price
          }));
          observer.next(this.getPrice(effectiveDate, numberOfStudents));
          observer.complete();
        });
      }
    });
    return price$;
  }

  getPrice(effectiveDate: Date, numberOfStudents: number): number {
    const effectiveRate = this.lessonRates
      .sort((rate1, rate2) => {
        if (rate1.effectiveDate > rate2.effectiveDate) { return -1; }
        if (rate1.effectiveDate < rate2.effectiveDate) { return 1; }
        if (rate1.numberOfStudents < rate2.numberOfStudents) { return 1; }
        if (rate1.numberOfStudents > rate2.numberOfStudents) { return -1; }
        return 0;
      })
      .find((rate) => rate.effectiveDate <= effectiveDate && rate.numberOfStudents <= numberOfStudents);
    return effectiveRate.price;
  }
}
