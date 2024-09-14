export interface ScheduleDay {
    date: string,
    rooms: ScheduleRoom[]
    timeSlots: ScheduleSlot[]
}

interface ScheduleSlot {
    slotStart: string,
    rooms: ScheduleSlotRoom[],
}

export interface ScheduleSlotRoom {
    id: number,
    name: string,
    session: ScheduleSession,
}

interface ScheduleSession {
    id: string,
    title: string,
    startsAt: string,
    endsAt: string,
    isServiceSession: boolean,
    info?: SessionInfo,
}

interface ScheduleRoom {
    id: number,
    sessions: ScheduleSession[],
}

interface ScheduleSession {
    id: string,
    title: string,
    startsAt: string,
    endsAt: string,
    isServiceSession: boolean,
    info?: SessionInfo,
}

export interface SessionInfo {
    id: string,
    slug: string,
    title: string,
    description: string,
    startsAt: string,
    endsAt: string,
    speakers?: Speaker[],
    roomId: number,
    room: string,
    sessionLevel: string,
    topics: string[],
    sessionType: string,
    language: string,
}

export interface SpeakerLinks {
    linkedin?: string,
    twitter?: string,
    github?: string,
    company?: string,
    websites: string[],
    facebook?: string,
    instagram?: string
}

export interface Speaker {
    id: string,
    slug: string,
    firstName: string,
    lastName: string,
    fullName: string,
    bio: string,
    tagLine: string,
    sessions?: SessionInfo[],
    profilePicture: string,
    links: SpeakerLinks,
}