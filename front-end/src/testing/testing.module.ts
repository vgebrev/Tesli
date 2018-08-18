/// Dummy module to satisfy Angular Language service. Never used.
import { NgModule } from '@angular/core';
import { RouterLinkStubDirective } from './router-link-directive.stub';
import {
    CalendarDateStubPipe,
    CalendarNextViewStubDirective,
    CalendarPreviousViewStubDirective,
    CalendarTodayStubDirective
} from './angular-calendar.stubs';
import { LoadingIndicatorStubComponent } from './loading-indicator.stub';

@NgModule({
  declarations: [
    CalendarDateStubPipe,
    CalendarNextViewStubDirective,
    CalendarPreviousViewStubDirective,
    CalendarTodayStubDirective,
    LoadingIndicatorStubComponent,
    RouterLinkStubDirective
  ]
})
export class TestingStubsModule {}
