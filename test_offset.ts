
// Imports removed to avoid resolution issues in simple script
// import { WebsiteConfig } from "./src/config";
// import { getSchedule } from "./src/data/repositories/sessionize_repository";

// Mock WebsiteConfig to test different offsets
// Note: Since WebsiteConfig properties are readonly, we might need to cast or use a different approach for testing if we were running in a real test runner.
// For this script, we'll just print the current config and the result of a date normalization if we could access the internal function, 
// but since normalizeSessionizeDate is not exported, we'll test via getSchedule or just copy the logic to verify.

// Actually, let's just copy the logic here to verify it works as expected with different inputs, 
// since we can't easily modify the readonly config at runtime without some hacks, 
// and we can't access the non-exported function.

function testNormalization(dateString: string, offsetMinutes: number, timezone: string) {
    console.log(`Testing with date: ${dateString}, offset: ${offsetMinutes}, timezone: ${timezone}`);

    // Logic from sessionize_repository.ts
    if (!dateString) return dateString;

    if (dateString.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(dateString)) {
        console.log("  Date already has timezone/offset, returning as is (logic might need adjustment if we want to apply offset even here?)");
        // The current implementation returns early if timezone is present. 
        // If the goal is to shift *any* date, we might need to change this.
        // But assuming the input is raw sessionize date without TZ.
    }

    const referenceDate = new Date(dateString + 'Z');
    const utcDate = new Date(referenceDate.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(referenceDate.toLocaleString('en-US', { timeZone: timezone }));
    const tzOffsetMinutes = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);

    const offsetHours = Math.floor(Math.abs(tzOffsetMinutes) / 60);
    const offsetMins = Math.abs(tzOffsetMinutes) % 60;
    const sign = tzOffsetMinutes >= 0 ? '+' : '-';
    const offsetString = `${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`;

    const dateWithTimezone = dateString + offsetString;
    console.log(`  Date with timezone: ${dateWithTimezone}`);

    if (offsetMinutes === 0) {
        return dateWithTimezone;
    }

    const dateObj = new Date(dateWithTimezone);
    dateObj.setMinutes(dateObj.getMinutes() + offsetMinutes);

    return dateObj.toISOString();
}

// Test cases
const dateStr = "2025-11-29T09:00:00";
console.log("Result (0 offset):", testNormalization(dateStr, 0, 'Europe/Rome'));
console.log("Result (60 offset):", testNormalization(dateStr, 60, 'Europe/Rome'));
console.log("Result (-30 offset):", testNormalization(dateStr, -30, 'Europe/Rome'));
