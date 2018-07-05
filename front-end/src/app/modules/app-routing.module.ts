import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from '../components/students/students.component';
import { StudentDetailComponent } from '../components/student-detail/student-detail.component';
import { CalendarComponent } from '../components/calendar/calendar/calendar.component';

const routes: Routes = [
  { path: 'students', component: StudentsComponent },
  { path: '', redirectTo: '/students', pathMatch: 'full' },
  { path: 'student/:id', component: StudentDetailComponent },
  { path: 'student', component: StudentDetailComponent },
  { path: 'calendar', component: CalendarComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
