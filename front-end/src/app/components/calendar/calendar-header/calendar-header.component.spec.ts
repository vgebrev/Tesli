import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarHeaderComponent } from './calendar-header.component';
import { Directive, Input, Output, HostListener, EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from 'src/app/modules/app-material.module';

@Directive({
  selector: '[mwlCalendarPreviousView]'
})
class CalendarPreviousViewDirectiveStub {
  @Input() view: string;
  @Input() viewDate: Date;
  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
  @HostListener('click')
  onClick(): void {}
}

@Directive({ selector: '[mwlCalendarNextView]' })
class CalendarNextViewDirectiveStub {
  @Input() view: string;
  @Input() viewDate: Date;
  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
  @HostListener('click')
  onClick(): void {}
}

@Directive({ selector: '[mwlCalendarToday]' })
class CalendarTodayDirectiveStub {
  @Input() viewDate: Date;
  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
  @HostListener('click')
  onClick(): void { }
}

@Pipe({ name: 'calendarDate' })
class CalendarDatePipeStub implements PipeTransform {
  transform(): string {
    return null;
  }
}

describe('CalendarHeaderComponent', () => {
  let component: CalendarHeaderComponent;
  let fixture: ComponentFixture<CalendarHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AppMaterialModule
      ],
      declarations: [ 
        CalendarHeaderComponent, 
        CalendarPreviousViewDirectiveStub,
        CalendarNextViewDirectiveStub,
        CalendarTodayDirectiveStub,
        CalendarDatePipeStub ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
