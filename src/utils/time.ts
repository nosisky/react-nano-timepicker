/**
 * Time utilities using native Date APIs
 * Zero external dependencies for minimal bundle size
 */

export interface TimeValue {
    hours: number;
    minutes: number;
}

/**
 * Parse a time string like "2:30pm" or "14:30" into hours and minutes
 */
export function parseTime(timeStr: string): TimeValue | null {
    const cleaned = timeStr.toLowerCase().replace(/\s/g, '');

    // Try 12-hour format: "2:30pm", "12:00am"
    const match12 = cleaned.match(/^(\d{1,2}):(\d{2})(am|pm)$/);
    if (match12) {
        let hours = parseInt(match12[1], 10);
        const minutes = parseInt(match12[2], 10);
        const period = match12[3];

        if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
            return null;
        }

        // Convert to 24-hour
        if (period === 'am') {
            hours = hours === 12 ? 0 : hours;
        } else {
            hours = hours === 12 ? 12 : hours + 12;
        }

        return { hours, minutes };
    }

    // Try 24-hour format: "14:30", "09:00"
    const match24 = cleaned.match(/^(\d{1,2}):(\d{2})$/);
    if (match24) {
        const hours = parseInt(match24[1], 10);
        const minutes = parseInt(match24[2], 10);

        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            return null;
        }

        return { hours, minutes };
    }

    return null;
}

/**
 * Format a TimeValue to a 12-hour string like "2:30pm"
 */
export function formatTime(time: TimeValue): string {
    const { hours, minutes } = time;
    const period = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const displayMinutes = minutes.toString().padStart(2, '0');

    return `${displayHours}:${displayMinutes}${period}`;
}

/**
 * Convert TimeValue to total minutes (for comparison)
 */
export function timeToMinutes(time: TimeValue): number {
    return time.hours * 60 + time.minutes;
}

/**
 * Generate an array of time strings from start to end at given interval
 */
export function generateTimeRange(
    startTime: string,
    endTime: string,
    intervalMinutes: number
): string[] {
    const start = parseTime(startTime);
    const end = parseTime(endTime);

    if (!start || !end) {
        return [];
    }

    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);

    if (startMinutes > endMinutes || intervalMinutes <= 0) {
        return [];
    }

    const times: string[] = [];
    let currentMinutes = startMinutes;

    while (currentMinutes <= endMinutes) {
        const hours = Math.floor(currentMinutes / 60);
        const minutes = currentMinutes % 60;
        times.push(formatTime({ hours, minutes }));
        currentMinutes += intervalMinutes;
    }

    return times;
}

/**
 * Validate if a string is a valid time format
 */
export function isValidTime(timeStr: string): boolean {
    return parseTime(timeStr) !== null;
}

/**
 * Filter times by user input (for typeahead functionality)
 */
export function filterTimesByInput(times: string[], input: string): string[] {
    const cleaned = input.toLowerCase().replace(/\s/g, '');
    if (!cleaned) return times;

    return times.filter((time) =>
        time.toLowerCase().replace(/\s/g, '').includes(cleaned)
    );
}

/**
 * Clean/normalize a time string
 */
export function cleanTimeString(time: string): string {
    return time.toLowerCase().replace(/\s/g, '');
}
