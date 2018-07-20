import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AmazingTimePickerModule } from 'amazing-time-picker';

import { AppComponent } from '../components/app/app.component';
import { StudentsComponent } from '../components/students/students.component';
import { StudentDetailComponent } from '../components/student-detail/student-detail.component';
import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app-material.module';
import { LoadingIndicatorComponent } from '../components/loading-indicator/loading-indicator.component';
import { CalendarComponent } from '../components/calendar/calendar/calendar.component';
import { CalendarHeaderComponent } from '../components/calendar/calendar-header/calendar-header.component';
import { LessonEditorComponent } from '../components/calendar/lesson-editor/lesson-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentsComponent,
    StudentDetailComponent,
    LoadingIndicatorComponent,
    CalendarComponent,
    CalendarHeaderComponent,
    LessonEditorComponent,
  ],
  entryComponents: [
    LessonEditorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    AppMaterialModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    AmazingTimePickerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
