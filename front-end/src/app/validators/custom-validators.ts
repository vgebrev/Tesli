import { Validators, FormControl, AbstractControl } from '@angular/forms';
import { Time } from '../model/time';

export class CustomValidators extends Validators {
  static time(control: AbstractControl) {
    if (!control.value) { return null; }

    const time = new Time(control.value);
    if (time.isValid) {
      return null;
    } else {
      return { time: true };
    }
  }

  static timeOrder(control: AbstractControl) {
    const startTimeControl = control.get('startTime');
    const endTimeControl = control.get('endTime');

    if (!startTimeControl.value || !endTimeControl.value) { return null; }

    const startTime = new Time(startTimeControl.value);
    const endTime = new Time(endTimeControl.value);

    if (!startTime.isValid || !endTime.isValid) { return null; }

    if (endTime.isBefore(startTime)) {
      startTimeControl.setErrors({ isAfterEndTime: true });
      endTimeControl.setErrors({ isBeforeStartTime: true });
    } else {
      startTimeControl.setErrors(null);
      endTimeControl.setErrors(null);
    }
    return null;
  }
}
