import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from '../components/students/students.component';
import { StudentDetailComponent } from '../components/student-detail/student-detail.component';

const routes: Routes = [
  { path: 'students', component: StudentsComponent },
  { path: '', redirectTo: '/students', pathMatch: 'full' },
  { path: 'student/:id', component: StudentDetailComponent },
  { path: 'student', component: StudentDetailComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
