import { getCurrentTimeInMilliSeconds, getCurrentTimeInSeconds } from "./dateHelper";

describe('Time Functions', () => {
    // Mock Date
    const REAL_DATE = Date;
    const mockDate = (timestamp: number) => {
        global.Date = class extends REAL_DATE {
            constructor() {
                super();
                return new REAL_DATE(timestamp);
            }
            getTime() {
                return timestamp;
            }
        } as any;
    };

    afterEach(() => {
        global.Date = REAL_DATE; // Restore original Date
    });

    test('getCurrentTimeInSeconds should return the current time in seconds', () => {
        const testTimestamp = 1609459200000; // Equivalent to 2021-01-01T00:00:00.000Z
        mockDate(testTimestamp);

        const expectedSeconds = Math.floor(testTimestamp / 1000);
        const seconds = getCurrentTimeInSeconds();
        expect(seconds).toBe(expectedSeconds);
    });

    test('getCurrentTimeInMilliSeconds should return the current time in milliseconds', () => {
        const testTimestamp = 1609459200000; // Equivalent to 2021-01-01T00:00:00.000Z
        mockDate(testTimestamp);

        const milliseconds = getCurrentTimeInMilliSeconds();
        expect(milliseconds).toBe(testTimestamp);
    });

    test('getCurrentTimeInSeconds should handle future dates', () => {
        const futureTimestamp = 1893456000000; // Future timestamp
        mockDate(futureTimestamp);

        const expectedSeconds = Math.floor(futureTimestamp / 1000);
        const seconds = getCurrentTimeInSeconds();
        expect(seconds).toBe(expectedSeconds);
    });

    test('getCurrentTimeInMilliSeconds should handle future dates', () => {
        const futureTimestamp = 1893456000000; // Future timestamp
        mockDate(futureTimestamp);

        const milliseconds = getCurrentTimeInMilliSeconds();
        expect(milliseconds).toBe(futureTimestamp);
    });

    // Negative Tests
    test('getCurrentTimeInSeconds should not return incorrect seconds', () => {
        const testTimestamp = 1609459200000; // Some specific time
        mockDate(testTimestamp);

        const incorrectSeconds = Math.floor((testTimestamp / 1000) + 100); // Incorrect time
        const seconds = getCurrentTimeInSeconds();
        expect(seconds).not.toBe(incorrectSeconds);
    });

    test('getCurrentTimeInMilliSeconds should not return incorrect milliseconds', () => {
        const testTimestamp = 1609459200000; // Some specific time
        mockDate(testTimestamp);

        const incorrectMilliseconds = testTimestamp + 100; // Incorrect time
        const milliseconds = getCurrentTimeInMilliSeconds();
        expect(milliseconds).not.toBe(incorrectMilliseconds);
    });
});
