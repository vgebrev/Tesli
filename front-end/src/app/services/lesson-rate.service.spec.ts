import { TestBed, inject } from '@angular/core/testing';

import { LessonRateService } from './lesson-rate.service';

describe('LessonRateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LessonRateService]
    });
  });

  it('should be created', inject([LessonRateService], (service: LessonRateService) => {
    expect(service).toBeTruthy();
  }));

  it('should return the expected price for the given date and number of students',
  inject([LessonRateService], (service: LessonRateService) => {
    const theory = [
      { date: new Date(2017, 0, 1), students: 1, expectedPrice: 300 },
      { date: new Date(2017, 0, 1), students: 2, expectedPrice: 230 },
      { date: new Date(2017, 0, 1), students: 3, expectedPrice: 180 },
      { date: new Date(2017, 0, 1), students: 4, expectedPrice: 130 },
      { date: new Date(2017, 0, 1), students: 5, expectedPrice: 130 },
      { date: new Date(2017, 0, 1), students: 6, expectedPrice: 130 },
      { date: new Date(2017, 0, 1), students: 7, expectedPrice: 90 },
      { date: new Date(2017, 0, 1), students: 8, expectedPrice: 90 },
      { date: new Date(2018, 0, 1), students: 1, expectedPrice: 300 },
      { date: new Date(2018, 0, 1), students: 2, expectedPrice: 240 },
      { date: new Date(2018, 0, 1), students: 3, expectedPrice: 190 },
      { date: new Date(2018, 0, 1), students: 4, expectedPrice: 140 },
      { date: new Date(2018, 0, 1), students: 5, expectedPrice: 140 },
      { date: new Date(2018, 0, 1), students: 6, expectedPrice: 140 },
      { date: new Date(2018, 0, 1), students: 7, expectedPrice: 100 },
      { date: new Date(2018, 0, 1), students: 8, expectedPrice: 100 },
    ];

    theory.forEach((testCase) => expect(service.getPrice(testCase.date, testCase.students)).toEqual(testCase.expectedPrice));
  }));
});
