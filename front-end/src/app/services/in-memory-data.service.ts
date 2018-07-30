import { InMemoryDbService } from 'angular-in-memory-web-api';
import { students } from './in-memory-data/students';
import { lessonRates } from './in-memory-data/lesson-rates';
import { lessons } from './in-memory-data/lessons';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    return {
      student: students,
      lessonRate: lessonRates,
      lesson: lessons
    };
  }
}
