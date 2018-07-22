import { Injectable } from '@angular/core';
import { LessonRate } from '../model/lesson-rate';

@Injectable({
  providedIn: 'root'
})
export class LessonRateService {
  // TODO: Load from API
  private rates: LessonRate[] = [
    { effectiveDate: new Date(0), numberOfStudents: 1, price: 300 },
    { effectiveDate: new Date(0), numberOfStudents: 2, price: 250 },
    { effectiveDate: new Date(0), numberOfStudents: 3, price: 200 },
    { effectiveDate: new Date(0), numberOfStudents: 4, price: 150 },
    { effectiveDate: new Date(0), numberOfStudents: 7, price: 100 },
    { effectiveDate: new Date(2017, 0, 1), numberOfStudents: 1, price: 300 },
    { effectiveDate: new Date(2017, 0, 1), numberOfStudents: 2, price: 230 },
    { effectiveDate: new Date(2017, 0, 1), numberOfStudents: 3, price: 180 },
    { effectiveDate: new Date(2017, 0, 1), numberOfStudents: 4, price: 130 },
    { effectiveDate: new Date(2017, 0, 1), numberOfStudents: 7, price: 90 },
    { effectiveDate: new Date(2018, 0, 1), numberOfStudents: 1, price: 300 },
    { effectiveDate: new Date(2018, 0, 1), numberOfStudents: 2, price: 240 },
    { effectiveDate: new Date(2018, 0, 1), numberOfStudents: 3, price: 190 },
    { effectiveDate: new Date(2018, 0, 1), numberOfStudents: 4, price: 140 },
    { effectiveDate: new Date(2018, 0, 1), numberOfStudents: 7, price: 100 },
  ];

  constructor() { }

  getPrice(effectiveDate: Date, numberOfStudents: number): number {
    const effectiveRate = this.rates
      .sort((rate1, rate2) => {
        if (rate1.effectiveDate > rate2.effectiveDate) { return -1; }
        if (rate1.effectiveDate < rate2.effectiveDate) { return 1; }
        if (rate1.numberOfStudents > rate2.numberOfStudents) { return -1; }
        if (rate1.numberOfStudents < rate2.numberOfStudents) { return 1; }
        return 0;
      })
      .find((rate) => rate.effectiveDate <= effectiveDate && rate.numberOfStudents <= numberOfStudents);
    return effectiveRate.price;
  }
}
