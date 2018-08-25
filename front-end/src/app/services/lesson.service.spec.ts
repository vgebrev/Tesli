import { TestBed, inject, async } from '@angular/core/testing';

import { LessonService } from './lesson.service';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { lessons } from './in-memory-data/lessons';
import { environment } from '../../environments/environment';
import { Lesson } from '../model/lesson';

describe('LessonService', () => {
  const lessonsUrl = `${environment.apiUrl}/lesson`;
  const errorResponse = { ok: false, statusText: 'Unknown Error' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [LessonService]
    });
  });

  afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
    backend.verify();
  }));

  it('should be created', inject([LessonService], (service: LessonService) => {
    expect(service).toBeTruthy();
  }));

  it('should GET a list of lessons when getLessons() is called',
    async(
      inject([LessonService, HttpTestingController], (service: LessonService, api: HttpTestingController) => {
        service.getLessons().subscribe((actualLessons) => {
          expect(actualLessons).toEqual(lessons);
        });

        api.expectOne((request: HttpRequest<any>) => {
            return request.url === lessonsUrl && request.method === 'GET';
        }).flush(lessons);
      })
    )
  );

  it('should throw an error when getLessons receives error response',
    async(inject([LessonService, HttpTestingController], (service: LessonService, api: HttpTestingController) => {
      service.getLessons().subscribe(
        (result) => { expect(result).toBeFalsy(); },
        (error) => {
          const actualError = {
            ok: error.ok,
            statusText: error.statusText
          };
          expect(actualError).toEqual(errorResponse);
        }
      );

      api.expectOne((request: HttpRequest<any>) => {
        return request.url === lessonsUrl && request.method === 'GET';
      }).error(new ErrorEvent('Network Error'));
    }))
  );

  it('should PUT lesson data when updateLesson is called',
    async(
      inject([LessonService, HttpTestingController], (service: LessonService, api: HttpTestingController) => {
        const lesson: Lesson = lessons[1];
        service.updateLesson(lesson).subscribe();
        api.expectOne((request: HttpRequest<any>) => {
          return request.url === `${lessonsUrl}/${lesson.id}`
            && request.method === 'PUT'
            && request.body === lesson;
        });
      })
    )
  );

  it('should throw error when updateLesson receives error response',
    async(
      inject([LessonService, HttpTestingController], (service: LessonService, api: HttpTestingController) => {
        const lesson: Lesson = lessons[1];
        service.updateLesson(lesson).subscribe(
          (result) => { expect(result).toBeFalsy(); },
          (error) => {
            const actualError = {
              ok: error.ok,
              statusText: error.statusText
            };
            expect(actualError).toEqual(errorResponse);
          }
        );
        api.expectOne((request: HttpRequest<any>) => {
          return request.url === `${lessonsUrl}/${lesson.id}`
            && request.method === 'PUT'
            && request.body === lesson;
        }).error(new ErrorEvent('Network Error'));
      })
    )
  );

  it('should POST lesson data when addLesson is called',
    async(
      inject([LessonService, HttpTestingController], (service: LessonService, api: HttpTestingController) => {
        const lesson: Lesson = {
          id: 0,
          date: new Date(),
          startTime: '15:00',
          endTime: '16:00',
          lessonAttendees: [],
          status: 'active'
        };
        service.addLesson(lesson).subscribe();
        api.expectOne((request: HttpRequest<any>) => {
          return request.url === lessonsUrl
            && request.method === 'POST'
            && request.body === lesson;
        });
      })
    )
  );

  it('should throw error when addLesson receives error response',
    async(
      inject([LessonService, HttpTestingController], (service: LessonService, api: HttpTestingController) => {
        const lesson: Lesson = {
          id: 0,
          date: new Date(),
          startTime: '15:00',
          endTime: '16:00',
          lessonAttendees: [],
          status: 'active'
        };
        service.addLesson(lesson).subscribe(
          (result) => { expect(result).toBeFalsy(); },
          (error) => {
            const actualError = {
              ok: error.ok,
              statusText: error.statusText
            };
            expect(actualError).toEqual(errorResponse);
          }
        );
        api.expectOne((request: HttpRequest<any>) => {
          return request.url === lessonsUrl
            && request.method === 'POST'
            && request.body === lesson;
        }).error(new ErrorEvent('Network error'));
      })
    )
  );
});
