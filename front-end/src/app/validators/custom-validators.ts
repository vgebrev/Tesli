import { Validators, FormControl, AbstractControl } from '@angular/forms';

export class CustomValidators extends Validators {
  static time(control: AbstractControl) {
    const time = control.value;
    if (!time) { return null; }

    const parts = time.split(':');
    if (parts.length !== 2) {
      return { time: { parsedTime: time, isInvalidFormat: true } };
    }

    const hour = +parts[0];
    const minute = +parts[1];
    const isValidHour = (hour >= 0 && hour <= 23);
    const isValidMinute = (minute >= 0 && minute <= 59);
    if (!isValidHour || !isValidMinute) {
      return { time: { parsedTime: time, isValidHour: isValidHour, isValidMinute: isValidMinute } };
    }
    return null;
  }

  static timeOrder(control: AbstractControl) {
    const startTimeControl = control.get('startTime');
    const endTimeControl = control.get('endTime');
    if (CustomValidators.time(startTimeControl) || CustomValidators.time(endTimeControl)) {
      return { time: { isInvalid: true } };
    }
    if (!startTimeControl.value || !endTimeControl.value) { return null; }
    const [startHour, startMinute] = startTimeControl.value.split(':');
    const [endHour, endMinute] = endTimeControl.value.split(':');

    if (+startHour > +endHour || (+startHour === +endHour && +startMinute > +endMinute)) {
      startTimeControl.setErrors({ isAfterEndTime: true });
      endTimeControl.setErrors({ isBeforeStartTime: true });
    } else {
      startTimeControl.setErrors(null);
      endTimeControl.setErrors(null);
    }
    return null;
  }
}
