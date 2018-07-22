import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentListComponent } from '../components/student/student-list/student-list.component';
import { StudentDetailComponent } from '../components/student/student-detail/student-detail.component';
import { CalendarComponent } from '../components/calendar/calendar/calendar.component';

const routes: Routes = [
  { path: 'students', component: StudentListComponent },
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
