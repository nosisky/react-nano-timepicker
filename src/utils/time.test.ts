import { describe, it, expect } from 'vitest';
import {
    parseTime,
    formatTime,
    generateTimeRange,
    isValidTime,
    filterTimesByInput,
    cleanTimeString,
    timeToMinutes,
} from './time';

describe('parseTime', () => {
    it('parses 12-hour format correctly', () => {
        expect(parseTime('2:30pm')).toEqual({ hours: 14, minutes: 30 });
        expect(parseTime('12:00am')).toEqual({ hours: 0, minutes: 0 });
        expect(parseTime('12:00pm')).toEqual({ hours: 12, minutes: 0 });
        expect(parseTime('11:59pm')).toEqual({ hours: 23, minutes: 59 });
        expect(parseTime('1:00am')).toEqual({ hours: 1, minutes: 0 });
    });

    it('parses 24-hour format correctly', () => {
        expect(parseTime('14:30')).toEqual({ hours: 14, minutes: 30 });
        expect(parseTime('00:00')).toEqual({ hours: 0, minutes: 0 });
        expect(parseTime('23:59')).toEqual({ hours: 23, minutes: 59 });
    });

    it('handles whitespace', () => {
        expect(parseTime(' 2:30pm ')).toEqual({ hours: 14, minutes: 30 });
        expect(parseTime('2 : 30 pm')).toEqual({ hours: 14, minutes: 30 }); // Strips all spaces
    });

    it('returns null for invalid times', () => {
        expect(parseTime('invalid')).toBeNull();
        expect(parseTime('25:00')).toBeNull();
        expect(parseTime('12:60pm')).toBeNull();
        expect(parseTime('13:00am')).toBeNull();
        expect(parseTime('')).toBeNull();
    });
});

describe('formatTime', () => {
    it('formats times correctly', () => {
        expect(formatTime({ hours: 14, minutes: 30 })).toBe('2:30pm');
        expect(formatTime({ hours: 0, minutes: 0 })).toBe('12:00am');
        expect(formatTime({ hours: 12, minutes: 0 })).toBe('12:00pm');
        expect(formatTime({ hours: 23, minutes: 59 })).toBe('11:59pm');
        expect(formatTime({ hours: 9, minutes: 5 })).toBe('9:05am');
    });
});

describe('timeToMinutes', () => {
    it('converts time to minutes correctly', () => {
        expect(timeToMinutes({ hours: 0, minutes: 0 })).toBe(0);
        expect(timeToMinutes({ hours: 1, minutes: 30 })).toBe(90);
        expect(timeToMinutes({ hours: 12, minutes: 0 })).toBe(720);
        expect(timeToMinutes({ hours: 23, minutes: 59 })).toBe(1439);
    });
});

describe('generateTimeRange', () => {
    it('generates time options with 30-minute interval', () => {
        const times = generateTimeRange('9:00am', '10:00am', 30);
        expect(times).toEqual(['9:00am', '9:30am', '10:00am']);
    });

    it('generates time options with 15-minute interval', () => {
        const times = generateTimeRange('9:00am', '9:30am', 15);
        expect(times).toEqual(['9:00am', '9:15am', '9:30am']);
    });

    it('generates time options with 60-minute interval', () => {
        const times = generateTimeRange('9:00am', '12:00pm', 60);
        expect(times).toEqual(['9:00am', '10:00am', '11:00am', '12:00pm']);
    });

    it('returns empty array for invalid times', () => {
        expect(generateTimeRange('invalid', '10:00am', 30)).toEqual([]);
        expect(generateTimeRange('9:00am', 'invalid', 30)).toEqual([]);
    });

    it('returns empty array when start is after end', () => {
        expect(generateTimeRange('10:00am', '9:00am', 30)).toEqual([]);
    });

    it('returns empty array for zero or negative interval', () => {
        expect(generateTimeRange('9:00am', '10:00am', 0)).toEqual([]);
        expect(generateTimeRange('9:00am', '10:00am', -30)).toEqual([]);
    });
});

describe('isValidTime', () => {
    it('validates correct times', () => {
        expect(isValidTime('2:30pm')).toBe(true);
        expect(isValidTime('12:00am')).toBe(true);
        expect(isValidTime('14:30')).toBe(true);
    });

    it('invalidates incorrect times', () => {
        expect(isValidTime('invalid')).toBe(false);
        expect(isValidTime('')).toBe(false);
        expect(isValidTime('25:00')).toBe(false);
    });
});

describe('filterTimesByInput', () => {
    const times = ['9:00am', '9:30am', '10:00am', '10:30am'];

    it('filters times by partial input', () => {
        expect(filterTimesByInput(times, '9')).toEqual(['9:00am', '9:30am']);
        expect(filterTimesByInput(times, '10:')).toEqual(['10:00am', '10:30am']);
        expect(filterTimesByInput(times, '30')).toEqual(['9:30am', '10:30am']);
    });

    it('returns all times for empty input', () => {
        expect(filterTimesByInput(times, '')).toEqual(times);
    });

    it('handles case insensitivity', () => {
        expect(filterTimesByInput(times, 'AM')).toEqual(times);
    });
});

describe('cleanTimeString', () => {
    it('cleans time strings correctly', () => {
        expect(cleanTimeString('2:30PM')).toBe('2:30pm');
        expect(cleanTimeString(' 2:30 pm ')).toBe('2:30pm');
        expect(cleanTimeString('2:30pm')).toBe('2:30pm');
    });
});
