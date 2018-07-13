import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StudentService } from './student.service';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

describe('StudentService', () => {
  const mockStudents = [
    { id: 1, name: 'Alice Cooper' },
    { id: 2, name: 'Bob Marley'}
  ];
  const studentsUrl = `${environment.apiUrl}/student`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule],
      providers: [StudentService]
    });
  });

  afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
    backend.verify();
  }));

  it('should be created', inject([StudentService], (service: StudentService) => {
    expect(service).toBeTruthy();
  }));

  it('should GET a list of students when getStudents() is called',
    async(
      inject([StudentService, HttpTestingController], (service: StudentService, api: HttpTestingController) => {
        service.getStudents().subscribe((students) => {
          expect(students).toEqual(mockStudents);
        });

        api.expectOne((request: HttpRequest<any>) => {
            return request.url === studentsUrl && request.method === 'GET';
        }).flush(mockStudents);
      })
    )
  );

  it('should GET a student when getStudent(id: number) is called',
    async(
      inject([StudentService, HttpTestingController], (service: StudentService, api: HttpTestingController) => {
        const id = 1;
        service.getStudent(id).subscribe((student) => {
          expect(student).toEqual(mockStudents[0]);
        });

        api.expectOne((request: HttpRequest<any>) => {
            return request.url === `${studentsUrl}/${id}` && request.method === 'GET';
        }).flush(mockStudents[0]);
      })
    )
  );

  it('should return 404 when getStudent(id: number) is called with invalid id',
    async(
      inject([StudentService, HttpTestingController], (service: StudentService, api: HttpTestingController) => {
        const id = 999;
        service.getStudent(id)
          .pipe(
            catchError((error) => {
              expect(error.name).toEqual('HttpErrorResponse');
              expect(error.status).toEqual(404);
              expect(error.statusText).toEqual('Not found');
              return of(null);
            })
          ).subscribe((student) => {
            expect(student).toBeFalsy();
          });

         api.expectOne((request: HttpRequest<any>) => {
             return request.url === `${studentsUrl}/${id}` && request.method === 'GET';
         }).flush(null, { status: 404, statusText: 'Not found' });
      })
    )
  );

  it('should PUT student data when updateStudent is called',
    async(
      inject([StudentService, HttpTestingController], (service: StudentService, api: HttpTestingController) => {
        const student = { id: 1, name: 'Updated Student' };
        service.updateStudent(student).subscribe();
        api.expectOne((request: HttpRequest<any>) => {
          return request.url === `${studentsUrl}/${student.id}`
            && request.method === 'PUT'
            && request.body === student;
        });
      })
    )
  );

  it('should POST student data when addStudent is called',
    async(
      inject([StudentService, HttpTestingController], (service: StudentService, api: HttpTestingController) => {
        const id = 0;
        const student = { id: 0, name: 'New Student' };
        service.addStudent(student).subscribe();
        api.expectOne((request: HttpRequest<any>) => {
          return request.url === `${studentsUrl}`
            && request.method === 'POST'
            && request.body === student;
        });
      })
    )
  );

  it('should DELETE a student when deleteStudent is called with an id',
    async(
      inject([StudentService, HttpTestingController], (service: StudentService, api: HttpTestingController) => {
        const id = 1;
        service.deleteStudent(id).subscribe();
        api.expectOne((request: HttpRequest<any>) => {
          return request.url === `${studentsUrl}/${id}`
            && request.method === 'DELETE';
        });
      })
    )
  );

  it('should DELETE a student when deleteStudent is called with a student object',
    async(
      inject([StudentService, HttpTestingController], (service: StudentService, api: HttpTestingController) => {
        const student = { id: 1, name: 'New Student' };
        service.deleteStudent(student).subscribe();
        api.expectOne((request: HttpRequest<any>) => {
          return request.url === `${studentsUrl}/${student.id}`
            && request.method === 'DELETE';
        });
      })
    )
  );
});
