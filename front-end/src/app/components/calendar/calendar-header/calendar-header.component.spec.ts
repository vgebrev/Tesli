import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarHeaderComponent } from './calendar-header.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '../../../modules/app-material.module';
import { CalendarPreviousViewDirectiveStub, CalendarNextViewDirectiveStub, CalendarTodayDirectiveStub, CalendarDatePipeStub } from '../../../../testing/calendar.stubs';


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
