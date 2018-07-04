import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { StudentService }  from '../../services/student.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  studentForm: FormGroup;
  isLoading = false;
  private id:number;

  constructor( 
    private route: ActivatedRoute,
    private studentService: StudentService,
    private location: Location,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForm();
    this.route.paramMap.subscribe(
      params => { 
        this.id = +params.get('id');
        this.getStudent(); 
      }
    );
  }

  createForm() {
    this.studentForm = this.formBuilder.group({
      id: 0,
      name: ['', Validators.required],
      grade: null,
      school: null,
      contactNumber: null,
      email: null,
      goals: null,
      parentName: null,
      address: null,
      parentContactNumber: null,
      parentEmail: null
    })
  }

  getStudent() {
    if (!this.id) return;
    this.isLoading = true;
    this.studentService.getStudent(this.id)
      .pipe(
        tap(() => this.isLoading = false),
        catchError(() => { this.isLoading = false; return of([]) }),
      ).subscribe(student => this.studentForm.setValue(student));
  }

  goBack() {
    this.location.back();
  }

  save() {
    if (!this.studentForm.valid) return false;
    const student = this.studentForm.value;
    const serviceAction = student.id ? 
      this.studentService.updateStudent(this.studentForm.value) : this.studentService.addStudent(this.studentForm.value);
    this.isLoading = true;
    serviceAction
      .pipe(
        tap(() => this.isLoading = false),
        catchError(() => { this.isLoading = false; return of([]) }),
      ).subscribe(() => this.goBack());
    return true;
  }
}
