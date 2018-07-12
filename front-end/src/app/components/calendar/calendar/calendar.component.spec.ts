import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { CalendarEventTimesChangedEvent } from 'angular-calendar';
import { CalendarComponent } from './calendar.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '../../../modules/app-material.module';

@Component({ selector: 'app-calendar-header', template: ''})
class CalendarHeaderComponentStub {
  @Input() view: string;
  @Input() viewDate: Date;
}

@Component({selector: 'mwl-calendar-month-view', template: ''})
class CalendarMonthViewComponentStub {  
  @Input() viewDate: Date;
  @Input() events = []; 
  @Input() activeDayIsOpen: boolean = false;
  @Input() refresh: Subject<any>;
  @Output()
  eventTimesChanged = new EventEmitter<CalendarEventTimesChangedEvent>();
}

@Component({selector: 'mwl-calendar-week-view', template: ''})
class CalendarWeekViewComponentStub {  
  @Input() viewDate: Date;
  @Input() events = []; 
  @Input() refresh: Subject<any>;
  @Output()
  eventTimesChanged = new EventEmitter<CalendarEventTimesChangedEvent>();
}

@Component({selector: 'mwl-calendar-day-view', template: ''})
class CalendarDayViewComponentStub {  
  @Input() viewDate: Date;
  @Input() events = []; 
  @Input() refresh: Subject<any>;
  @Input() hourSegments: number = 4;
  @Input() dayStartHour: number = 0;
  @Input() dayEndHour: number = 23;
  @Output()
  eventTimesChanged = new EventEmitter<CalendarEventTimesChangedEvent>();
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
        CalendarHeaderComponentStub,
        CalendarMonthViewComponentStub,
        CalendarWeekViewComponentStub,
        CalendarDayViewComponentStub
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
