import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '../../../modules/app-material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { LessonDateTimePickerComponent } from './lesson-date-time-picker.component';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { Subject } from 'rxjs';

fdescribe('LessonDateTimePickerComponent', () => {
  let component: LessonDateTimePickerComponent;
  let fixture: ComponentFixture<LessonDateTimePickerComponent>;
  const timePickerClose$ = new Subject();

  beforeEach(async(() => {
    const amazingTimePickerServiceSpy = jasmine.createSpyObj<AmazingTimePickerService>(['open']);
    amazingTimePickerServiceSpy.open.and.callFake(() => ({ afterClose: () => timePickerClose$ }));
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AppMaterialModule,
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [ LessonDateTimePickerComponent ],
      providers: [
        { provide: AmazingTimePickerService, useValue: amazingTimePickerServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonDateTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call open on AmazingTimePicker service when openTimePicker is called',
  inject([AmazingTimePickerService], (timePickerService: AmazingTimePickerService) => {
    component.openTimePicker('start');
    expect(timePickerService.open).toHaveBeenCalledWith({
        time: component.lessonDateTimeForm.get('startTime').value,
        theme: 'dark',
        preference: {
          labels: {
            ok: 'OK'
          }
        }
    });
    timePickerClose$.next('10:00');
    expect(component.lessonDateTimeForm.get('startTime').value).toBe('10:00');
  }));

  it('should emit dateTimeChange event with the onFormChanged is called and form value is valid', () => {
    const expectedValue = {
      date: new Date(),
      startTime: '11:45',
      endTime: '12:45'
    };

    component.dateTimeChange.subscribe((dateTime) => {
      expect(dateTime).toEqual(expectedValue);
    });

    component.lessonDateTimeForm.patchValue(expectedValue);
    component.onFormChanged();
  });
});
