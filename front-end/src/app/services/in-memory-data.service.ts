import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Student } from '../models/student';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const students: Student[] = [
        { id: 11, firstName: 'Alice', surname: 'Cooper'},
        { id: 12, firstName: 'Bob', surname: 'Marley'},
        { id: 13, firstName: 'Chuck', surname: 'Berry'},
        { id: 14, firstName: 'Dave', surname: 'Grohl'},
        { id: 15, firstName: 'Eric', surname: 'Clapton'},
        { id: 16, firstName: 'Fred', surname: 'Durst'},
        { id: 17, firstName: 'Gwen', surname: 'Stefani'},
        { id: 18, firstName: 'Hugh', surname: 'Masekela'},
        { id: 19, firstName: 'Izzy', surname: 'Pop'},
        { id: 20, firstName: 'Jack', surname: 'White'},
    ]
    return {students};
  }
}