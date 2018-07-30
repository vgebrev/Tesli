import { TestBed, inject } from '@angular/core/testing';

import { LessonService } from './lesson.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LessonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [LessonService]
    });
  });

  it('should be created', inject([LessonService], (service: LessonService) => {
    expect(service).toBeTruthy();
  }));
});
