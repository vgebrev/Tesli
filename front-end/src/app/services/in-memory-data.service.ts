import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Student } from '../models/student';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const students: Student[] = [
        { id: 11, name: 'Alice Cooper'},
        { id: 12, name: 'Bob Marley'},
        { id: 13, name: 'Chuck Berry'},
        { id: 14, name: 'Dave Grohl'},
        { id: 15, name: 'Eric Clapton'},
        { id: 16, name: 'Fred Durst'},
        { id: 17, name: 'Gwen Stefani'},
        { id: 18, name: 'Hugh Masekela'},
        { id: 19, name: 'Izzy Pop'},
        { id: 20, name: 'Jack White'},
    ];
    return {students};
  }
}
