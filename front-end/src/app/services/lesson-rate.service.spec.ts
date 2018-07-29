import { TestBed, inject } from '@angular/core/testing';

import { LessonRateService } from './lesson-rate.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LessonRateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule],
      providers: [LessonRateService]
    });
  });

  it('should be created', inject([LessonRateService], (service: LessonRateService) => {
    expect(service).toBeTruthy();
  }));

  it('getPrice returns the correct price for a given date and number of students',
  inject([LessonRateService], (service: LessonRateService) => {
    const jan1st2016 = new Date(2016, 0, 1);
    const jan1st2017 = new Date(2017, 0, 1);
    const jan1st2018 = new Date(2018, 0, 1);
    const theory = [
      { date: jan1st2016, students: 1, expectedPrice: 300 },
      { date: jan1st2016, students: 2, expectedPrice: 250 },
      { date: jan1st2016, students: 3, expectedPrice: 200 },
      { date: jan1st2016, students: 4, expectedPrice: 150 },
      { date: jan1st2016, students: 5, expectedPrice: 150 },
      { date: jan1st2016, students: 6, expectedPrice: 150 },
      { date: jan1st2016, students: 7, expectedPrice: 100 },
      { date: jan1st2016, students: 8, expectedPrice: 100 },
      { date: jan1st2017, students: 1, expectedPrice: 300 },
      { date: jan1st2017, students: 2, expectedPrice: 230 },
      { date: jan1st2017, students: 3, expectedPrice: 180 },
      { date: jan1st2017, students: 4, expectedPrice: 130 },
      { date: jan1st2017, students: 5, expectedPrice: 130 },
      { date: jan1st2017, students: 6, expectedPrice: 130 },
      { date: jan1st2017, students: 7, expectedPrice: 90 },
      { date: jan1st2017, students: 8, expectedPrice: 90 },
      { date: jan1st2018, students: 1, expectedPrice: 300 },
      { date: jan1st2018, students: 2, expectedPrice: 240 },
      { date: jan1st2018, students: 3, expectedPrice: 190 },
      { date: jan1st2018, students: 4, expectedPrice: 140 },
      { date: jan1st2018, students: 5, expectedPrice: 140 },
      { date: jan1st2018, students: 6, expectedPrice: 140 },
      { date: jan1st2018, students: 7, expectedPrice: 100 },
      { date: jan1st2018, students: 8, expectedPrice: 100 },
    ];

    theory.forEach((testCase) => {
      service.getPrice$(testCase.date, testCase.students).subscribe((actualPrice) => expect(actualPrice).toEqual(testCase.expectedPrice));
    });
  }));
});
