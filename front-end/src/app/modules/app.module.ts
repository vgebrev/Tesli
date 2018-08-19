import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { HttpClientModule } from '@angular/common/http';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AmazingTimePickerModule } from 'amazing-time-picker';

import { AppComponent } from '../components/app/app.component';
import { StudentListComponent } from '../components/student/student-list/student-list.component';
import { StudentDetailComponent } from '../components/student/student-detail/student-detail.component';
import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app-material.module';
import { LoadingIndicatorComponent } from '../components/loading-indicator/loading-indicator.component';
import { CalendarComponent } from '../components/calendar/calendar/calendar.component';
import { CalendarHeaderComponent } from '../components/calendar/calendar-header/calendar-header.component';
import { LessonEditorComponent } from '../components/lesson/lesson-editor/lesson-editor.component';
import { LessonAttendeeListComponent } from '../components/lesson/lesson-attendee-list/lesson-attendee-list.component';
import { LessonDateTimePickerComponent } from '../components/lesson/lesson-date-time-picker/lesson-date-time-picker.component';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { LessonAttendeePickerComponent } from '../components/lesson/lesson-attendee-picker/lesson-attendee-picker.component';
// import { InMemoryDataService } from '../services/in-memory-data.service';
import { LessonRepeaterComponent } from '../components/lesson/lesson-repeater/lesson-repeater.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentListComponent,
    StudentDetailComponent,
    LoadingIndicatorComponent,
    CalendarComponent,
    CalendarHeaderComponent,
    LessonEditorComponent,
    LessonAttendeeListComponent,
    LessonDateTimePickerComponent,
    LessonAttendeePickerComponent,
    LessonRepeaterComponent,
  ],
  entryComponents: [
    LessonEditorComponent,
    LessonRepeaterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    // HttpClientInMemoryWebApiModule.forRoot(
    //   InMemoryDataService, { dataEncapsulation: false }
    // ),
    AppMaterialModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    AmazingTimePickerModule,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
