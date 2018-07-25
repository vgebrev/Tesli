import { TestBed, inject } from '@angular/core/testing';

import { CustomValidators } from './custom-validators';
import { FormBuilder, AbstractControl } from '@angular/forms';

describe('CustomValidators', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormBuilder]
    });
  });

  function buildForm(formBuilder: FormBuilder, startTime?: string, endTime?: string): AbstractControl {
    return formBuilder.group({
      startTime: [startTime, CustomValidators.time],
      endTime: [endTime, CustomValidators.time]
    }, { validator: CustomValidators.timeOrder });
  }

  it('time is valid if control value is not set', inject([FormBuilder], (formBuilder: FormBuilder) => {
    const form = buildForm(formBuilder);

    expect(form.valid).toBeTruthy();
  }));

  it('time is invalid if not in format hh:mm', inject([FormBuilder], (formBuilder: FormBuilder) => {
    const form = buildForm(formBuilder, 'invalid time');

    expect(form.valid).toBeFalsy();
  }));

  it('time is invalid if hour is not between 0 and 23', inject([FormBuilder], (formBuilder: FormBuilder) => {
    const form = buildForm(formBuilder, '-1:00');

    expect(form.valid).toBeFalsy();
    form.get('startTime').setValue('24:00');
    expect(form.valid).toBeFalsy();
  }));

  it('time is invalid if minute is not between 0 and 59', inject([FormBuilder], (formBuilder: FormBuilder) => {
    const form = buildForm(formBuilder, '01:-1');

    expect(form.valid).toBeFalsy();
    form.get('startTime').setValue('01:60');
    expect(form.valid).toBeFalsy();
  }));

  it('time is valid if in format hh:mm and hour is between 0 and 23 and minute is between 0 and 59',
  inject([FormBuilder], (formBuilder: FormBuilder) => {
    const form = buildForm(formBuilder, '15:00');

    expect(form.valid).toBeTruthy();
  }));

  it('timeOrder is valid if start time is invalid', inject([FormBuilder], (formBuilder: FormBuilder) => {
    const form = buildForm(formBuilder, 'invalid start', '16:00');

    expect(form.get('startTime').hasError('isAfterEndTime')).toBeFalsy();
    expect(form.get('endTime').hasError('isBeforeStartTime')).toBeFalsy();
  }));

  it('timeOrder is valid if end time is invalid', inject([FormBuilder], (formBuilder: FormBuilder) => {
    const form = buildForm(formBuilder, '15:00', 'invalid');

    expect(form.get('startTime').hasError('isAfterEndTime')).toBeFalsy();
    expect(form.get('endTime').hasError('isBeforeStartTime')).toBeFalsy();
  }));

  it('timeOrder is invalid if start time is after end time', inject([FormBuilder], (formBuilder: FormBuilder) => {
    const form = buildForm(formBuilder, '16:00', '15:00');

    expect(form.get('startTime').hasError('isAfterEndTime')).toBeTruthy();
    expect(form.get('endTime').hasError('isBeforeStartTime')).toBeTruthy();
  }));

  it('timeOrder is invalid if start time is the same as end time', inject([FormBuilder], (formBuilder: FormBuilder) => {
    const form = buildForm(formBuilder, '15:00', '15:00');

    expect(form.get('startTime').hasError('isAfterEndTime')).toBeTruthy();
    expect(form.get('endTime').hasError('isBeforeStartTime')).toBeTruthy();
  }));

  it('timeOrder is valid if start time is before end time', inject([FormBuilder], (formBuilder: FormBuilder) => {
    const form = buildForm(formBuilder, '15:00', '15:45');

    expect(form.get('startTime').hasError('isAfterEndTime')).toBeFalsy();
    expect(form.get('endTime').hasError('isBeforeStartTime')).toBeFalsy();
  }));
});
