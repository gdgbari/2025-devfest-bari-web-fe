/**
 * Utility functions for formatting various data types
 */

/**
 * Formats milliseconds into a human-readable duration string
 * @param milliseconds - The duration in milliseconds
 * @returns A formatted duration string (e.g., "2 min 30 sec", "1 h 15 min")
 */
export function formatDuration(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);

    if (totalSeconds < 60) {
        return `${totalSeconds} sec`;
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes < 60) {
        if (seconds === 0) {
            return `${minutes} min`;
        }
        return `${minutes} min ${seconds} sec`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
        return `${hours} h`;
    }
    return `${hours} h ${remainingMinutes} min`;
}
