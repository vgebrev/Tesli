import { Time } from './time';

describe('Time', () => {
    it('shoud construct with valid time', () => {
        const time = new Time('15:00');
        expect(time.isValid).toBeTruthy();
        expect(time.hour).toBe(15);
        expect(time.minute).toBe(0);
    });

    it('shoud construct with null', () => {
        const time = new Time(null);
        expect(time.isValid).toBeFalsy();
        expect(time.hour).toBe(undefined);
        expect(time.minute).toBe(undefined);
    });

    it('shoud construct with invalid time format', () => {
        const time = new Time('invalid time');
        expect(time.isValid).toBeFalsy();
        expect(time.hour).toBeNaN();
        expect(time.minute).toBeNaN();
    });

    it('shoud construct with invalid hour less than 0', () => {
        const time = new Time('-1:15');
        expect(time.isValid).toBeFalsy();
        expect(time.hour).toBe(-1);
        expect(time.minute).toBe(15);
    });

    it('shoud construct with invalid hour more than 23', () => {
        const time = new Time('24:15');
        expect(time.isValid).toBeFalsy();
        expect(time.hour).toBe(24);
        expect(time.minute).toBe(15);
    });

    it('shoud construct with invalid minute less than 0', () => {
        const time = new Time('15:-1');
        expect(time.isValid).toBeFalsy();
        expect(time.hour).toBe(15);
        expect(time.minute).toBe(-1);
    });

    it('shoud construct with invalid minute more than 59', () => {
        const time = new Time('15:60');
        expect(time.isValid).toBeFalsy();
        expect(time.hour).toBe(15);
        expect(time.minute).toBe(60);
    });

    it('isBefore should return true if instance hour is less than argument hour', () => {
        const before = new Time('15:00');
        const after = new Time('16:00');
        expect(before.isBefore(after)).toBeTruthy();
    });

    it('isBefore should return false if instance hour is more than argument hour', () => {
        const before = new Time('16:00');
        const after = new Time('15:00');
        expect(before.isBefore(after)).toBeFalsy();
    });

    it('isBefore should return true if instance hour is same as argument hour and instance minute is less than argument minute', () => {
        const before = new Time('15:00');
        const after = new Time('15:01');
        expect(before.isBefore(after)).toBeTruthy();
    });

    it('isBefore should return false if instance hour is same as argument hour and instance minute is same as argument minute', () => {
        const before = new Time('15:00');
        const after = new Time('15:00');
        expect(before.isBefore(after)).toBeFalsy();
    });

    it('isBefore should return false if instance hour is same as argument hour and instance minute is more than argument minute', () => {
        const before = new Time('15:01');
        const after = new Time('15:00');
        expect(before.isBefore(after)).toBeFalsy();
    });

    it('isSame should return true if instance hour is same as argument hour and minute is same as argument minute', () => {
        const before = new Time('15:00');
        const after = new Time('15:00');
        expect(before.isSame(after)).toBeTruthy();
    });

    it('isSame should return false if instance hour is not same as argument hour and minute is same as argument minute', () => {
        const before = new Time('15:00');
        const after = new Time('16:00');
        expect(before.isSame(after)).toBeFalsy();
    });

    it('isSame should return false if instance hour is same as argument hour and minute is not same as argument minute', () => {
        const before = new Time('16:00');
        const after = new Time('16:01');
        expect(before.isSame(after)).toBeFalsy();
    });

    it('isSame should return false if instance hour is not same as argument hour and minute is not same as argument minute', () => {
        const before = new Time('15:00');
        const after = new Time('16:01');
        expect(before.isSame(after)).toBeFalsy();
    });
});
