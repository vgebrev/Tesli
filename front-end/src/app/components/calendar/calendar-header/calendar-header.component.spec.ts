import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarHeaderComponent } from './calendar-header.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '../../../modules/app-material.module';
import {
  CalendarPreviousViewStubDirective,
  CalendarNextViewStubDirective,
  CalendarTodayStubDirective,
  CalendarDateStubPipe
} from '../../../../testing/angular-calendar.stubs';
import { By } from '@angular/platform-browser';


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
        CalendarPreviousViewStubDirective,
        CalendarNextViewStubDirective,
        CalendarTodayStubDirective,
        CalendarDateStubPipe ]
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

  it('should change view when toggle button is clicked', () => {
    const toggleButtons = fixture.debugElement.queryAll(By.css('mat-button-toggle'));
    let selectedView: string;
    component.viewChange.subscribe((view) => selectedView = view);

    toggleButtons.forEach((toggleButtonDebugElement) => {
      const nativeElement = toggleButtonDebugElement.nativeElement;
      nativeElement.click();
      expect(selectedView).toBe(nativeElement.value);
    });
  });

  it('should trigger viewChange when onViewToggleChanged is called', () => {
    let selectedView: string;
    component.viewChange.subscribe((view) => selectedView = view);
    component.onViewToggleChanged({ value: 'month' });
    expect(selectedView).toBe('month');
  });

  it('should change date when the date button is clicked', () => {
    const dateButtons = fixture.debugElement.queryAll(By.css('button'));
    let selectedDate: Date;
    component.viewDateChange.subscribe((viewDate) => selectedDate = viewDate);

    dateButtons.forEach((dateChangeButton) => {
      dateChangeButton.nativeElement.click();
      expect(selectedDate).toBe(component.viewDate);
    });
  });

  it('should trigger viewDateChange when onViewToggleChanged is called', () => {
    let selectedViewDate: Date;
    const now = new Date();
    component.viewDateChange.subscribe((viewDate) => selectedViewDate = viewDate);
    component.onViewDateChanged(now);
    expect(selectedViewDate).toBe(now);
  });
});
