export class Time {
    isValid: boolean;
    hour?: number;
    minute?: number;
    constructor(time: string) {
        this.parse(time);
    }

    parse(time: string) {
        if (time === null) {
            this.isValid = false;
            return false;
        }

        const parts = time.split(':');
        this.hour = +parts[0];
        this.minute = +parts[1];

        this.isValid = this.hour >= 0 && this.hour <= 23 && this.minute >= 0 && this.minute <= 59;
        return this.isValid;
    }

    isBefore(time: Time) {
      return this.hour < time.hour || (this.hour === time.hour && this.minute < time.minute);
    }

    isSame(time: Time) {
      return this.hour === time.hour && this.minute === time.minute;
    }
}
