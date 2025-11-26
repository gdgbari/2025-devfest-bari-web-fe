import type { LeaderBoardUser } from "./types"

/**
 * Comparator function for sorting leaderboard users.
 * Logic:
 * 1. Score (Descending)
 * 2. Updated At (Ascending) - Earlier timestamp first?
 *    Wait, user snippet: a.timestamp.compareTo(b.timestamp)
 *    If timestamp is a number (epoch), a - b is ascending.
 *    Usually for leaderboards, if scores are tied, the one who achieved it FIRST (earlier timestamp) is ranked higher.
 *    So Ascending timestamp makes sense (smaller timestamp = earlier time).
 * 3. Nickname (Ascending, case-insensitive)
 */
export const compareLeaderboardUsers = (
    a: LeaderBoardUser,
    b: LeaderBoardUser
): number => {
    // 1. Score: Descending (Higher is better)
    // User snippet: b.score.compareTo(a.score) => b - a
    if (b.score !== a.score) {
        return b.score - a.score
    }

    // 2. Timestamp: Ascending (Earlier is better/higher rank)
    // User snippet: a.timestamp.compareTo(b.timestamp) => a - b
    if (b.updated_at !== a.updated_at) {
        return a.updated_at - b.updated_at
    }

    // 3. Nickname: Ascending (Alphabetical)
    // User snippet: a.nickname.toLowerCase().compareTo(b.nickname.toLowerCase())
    return a.nickname.toLowerCase().localeCompare(b.nickname.toLowerCase())
}
