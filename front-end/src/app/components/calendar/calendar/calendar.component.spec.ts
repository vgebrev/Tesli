import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { CalendarComponent } from './calendar.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '../../../modules/app-material.module';
import {
  CalendarMonthViewStubComponent,
  CalendarWeekViewStubComponent,
  CalendarDayViewStubComponent
} from '../../../../testing/angular-calendar.stubs';

@Component({ selector: 'app-calendar-header', template: ''})
class CalendarHeaderStubComponent {
  @Input() view: string;
  @Input() viewDate: Date;
}

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AppMaterialModule
      ],
      declarations: [
        CalendarComponent,
        CalendarHeaderStubComponent,
        CalendarMonthViewStubComponent,
        CalendarWeekViewStubComponent,
        CalendarDayViewStubComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
