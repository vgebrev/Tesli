import { TestBed, inject, async, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';

import { LessonRateService } from './lesson-rate.service';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { lessonRates as lessonRatesWithUtcDates } from './in-memory-data/lesson-rates';
import { environment } from '../../environments/environment';

describe('LessonRateService', () => {
  const lessonRatesUrl = `${environment.apiUrl}/lessonRate`;
  const lessonRates = lessonRatesWithUtcDates.map((utcLessonRate) => ({
    effectiveDate: new Date(utcLessonRate.effectiveDate.getTime() + utcLessonRate.effectiveDate.getTimezoneOffset() * 60 * 1000),
    numberOfStudents: utcLessonRate.numberOfStudents,
    price: utcLessonRate.price
  }));
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

  it('should GET a list of lesson rates when getLessonRates() is called',
  async(inject([LessonRateService, HttpTestingController], (service: LessonRateService, api: HttpTestingController) => {
    service.getLessonRates().subscribe((returnedLessonRates) => {
      expect(returnedLessonRates).toEqual(lessonRates);
    });

    api.expectOne((request: HttpRequest<any>) => {
        return request.url === lessonRatesUrl && request.method === 'GET';
    }).flush(lessonRates);
  })));

  it('should throw an error observable if an HTTP error occurs in getLessonRates',
  async(inject([LessonRateService, HttpTestingController], (service: LessonRateService, api: HttpTestingController) => {
      service.getLessonRates().subscribe(() => {
        expect(true).toBeFalsy(); // this should not be reached when an error is thrown;
      }, (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
        expect(error.ok).toBeFalsy();
      });

      api.expectOne((request: HttpRequest<any>) => {
          return request.url === lessonRatesUrl && request.method === 'GET';
      }).flush(null, { status: 500, statusText: 'Internal Server Error' });
  })));

  it('getPrice$ returns the correct price for a given date and number of students',
  async(inject([LessonRateService, HttpTestingController], (service: LessonRateService, api: HttpTestingController) => {
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

    api.match((request: HttpRequest<any>) => {
      return request.url === lessonRatesUrl && request.method === 'GET';
    }).forEach((request) => request.flush(lessonRates));
  })));

  it('getPrice$ should use cached lessonRates once loaded from api',
  async(inject([LessonRateService, HttpTestingController], (service: LessonRateService, api: HttpTestingController) => {
    const jan1st2018 = new Date(2018, 0, 1);
    service.getPrice$(jan1st2018, 1).subscribe((price1) => {
     expect(price1).toBe(300);
     service.getPrice$(jan1st2018, 1).subscribe((price2) => {
      expect(price2).toBe(300);
     });
    });

    api.expectOne((request: HttpRequest<any>) => {
      return request.url === lessonRatesUrl && request.method === 'GET';
    }).flush(lessonRates);
  })));

  it('should handle duplicate lesson rates',
  async(inject([LessonRateService, HttpTestingController], (service: LessonRateService, api: HttpTestingController) => {
    const lessonRatesWithADuplicate = lessonRates.slice(0);
    lessonRatesWithADuplicate.push(Object.assign({}, lessonRates[lessonRates.length - 1]));
    const jan1st2018 = new Date(2018, 0, 1);
    service.getPrice$(jan1st2018, 1).subscribe((price) => {
     expect(price).toBe(300);
    });
    api.expectOne((request: HttpRequest<any>) => {
      return request.url === lessonRatesUrl && request.method === 'GET';
    }).flush(lessonRatesWithADuplicate);
  })));
});
