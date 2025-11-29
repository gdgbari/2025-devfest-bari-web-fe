import { WebsiteConfig } from "../../config";
import { SessionizeApi } from "../api/sessionize_api";
import type { ScheduleDay, SessionInfo, Speaker } from "../types/sessionize";

const defaultProfileImage = "/assets/vectors/user_circle.svg"

function addOffset(dateWithTimezone: string) {
    // Se non c'è offset configurato, ritorniamo la data con timezone
    if (WebsiteConfig.OFFSET_SCHEDULE_MINUTES === 0) {
        return dateWithTimezone;
    }

    // Altrimenti applichiamo l'offset configurato
    const dateObj = new Date(dateWithTimezone);
    dateObj.setMinutes(dateObj.getMinutes() + WebsiteConfig.OFFSET_SCHEDULE_MINUTES);

    return dateObj.toISOString();
}

/**
 * Normalizza le stringhe di date da Sessionize aggiungendo il timezone se manca
 */
function normalizeSessionizeDate(dateString: string): string {
    if (!dateString) return dateString;

    // Se termina già con 'Z' o ha un offset timezone, non modificare
    if (dateString.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(dateString)) {
        return addOffset(dateString);
    }

    // Se il timezone configurato è UTC, basta aggiungere 'Z'
    if (WebsiteConfig.EVENT_TIMEZONE === 'UTC') {
        return addOffset(dateString + 'Z');
    }

    // Per altri timezone, calcoliamo l'offset rispetto a UTC
    // Creiamo una data di riferimento dalla stringa
    const referenceDate = new Date(dateString + 'Z'); // Temporaneamente come UTC per il parsing

    // Otteniamo l'offset del timezone dell'evento in minuti
    const utcDate = new Date(referenceDate.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(referenceDate.toLocaleString('en-US', { timeZone: WebsiteConfig.EVENT_TIMEZONE }));
    const offsetMinutes = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);

    // Convertiamo l'offset in formato ISO (+HH:MM o -HH:MM)
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    const offsetMins = Math.abs(offsetMinutes) % 60;
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const offsetString = `${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`;

    return addOffset(dateString + offsetString);
}
/**
 * Debug helper: Forces a date to today while preserving the original time
 */
function forceToToday(originalDateString: string): string {
    if (!WebsiteConfig.DEBUG_FORCE_EVENT_TODAY) {
        return normalizeSessionizeDate(originalDateString);
    }

    console.log(`🔧 DEBUG: Processing date ${originalDateString}`);

    const originalDate = new Date(normalizeSessionizeDate(originalDateString));
    const today = new Date();

    // Preserve the original time but set to today's date
    const forcedDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        originalDate.getHours(),
        originalDate.getMinutes(),
        originalDate.getSeconds(),
        originalDate.getMilliseconds()
    );

    const forcedDateString = forcedDate.toISOString();
    return forcedDateString;
}

export async function getSchedule(): Promise<Promise<ScheduleDay[]>> {
    const sessionsInfo = await getSessions(true);
    const schedule: ScheduleDay[] = await SessionizeApi.get('GridSmart');

    schedule.forEach(
        (day, dayIdx) => {

            // Normalizza la data del giorno
            day.date = normalizeSessionizeDate(day.date);

            // Apply debug date forcing to the day itself if enabled
            if (WebsiteConfig.DEBUG_FORCE_EVENT_TODAY) {
                day.date = forceToToday(day.date);
            }

            day.timeSlots.forEach((slot, slot_idx) => {

                slot.rooms.forEach((room) => {
                    // Normalizza le date delle sessioni
                    room.session.startsAt = normalizeSessionizeDate(room.session.startsAt);
                    room.session.endsAt = normalizeSessionizeDate(room.session.endsAt);

                    // Apply debug date forcing if enabled
                    if (WebsiteConfig.DEBUG_FORCE_EVENT_TODAY) {
                        room.session.startsAt = forceToToday(room.session.startsAt);
                        room.session.endsAt = forceToToday(room.session.endsAt);
                    }
                });

                day.timeSlots[slot_idx].slotStart = new Date(slot.rooms[0].session.startsAt).toLocaleString("it", { timeZone: WebsiteConfig.EVENT_TIMEZONE, hour: "numeric", minute: "numeric" })

                slot.rooms.forEach(
                    room => {
                        const sessionInfoFound = sessionsInfo.find((_s) => _s.id == room.session.id);
                        room.session.info = sessionInfoFound;
                    },
                )
            });
        },
    );

    return schedule;
}

export async function getSessions(includeSpeakers: boolean = false): Promise<SessionInfo[]> {
    const sessionResult: any[] = await SessionizeApi.get('Sessions');
    const speakers = includeSpeakers ? await getSpeakers() : null;
    const sessionsRaw: any[] = sessionResult[0].sessions;

    const sessions = sessionsRaw.map(s => parseSession(s, speakers));

    return sessions;
}

function parseSession(sessionRaw: any, speakers: Speaker[] | null): SessionInfo {
    const sessionSlug = sessionRaw.title.toLowerCase()
        .replaceAll(' ', '-')
        .replaceAll(/[.'/":*+?^${}()|[\]\\,“”!]/g, '')
        .replaceAll(/-{2,}/g, '-');

    const session: SessionInfo = {
        id: sessionRaw.id,
        slug: sessionSlug,
        title: sessionRaw.title,
        description: sessionRaw.description,
        startsAt: forceToToday(sessionRaw.startsAt),
        endsAt: forceToToday(sessionRaw.endsAt),
        roomId: sessionRaw.roomId,
        room: sessionRaw.room,
        sessionLevel: "",
        topics: [],
        sessionType: "",
        language: ""
    };


    const additionalProperties = sessionRaw.categories.map(c => {
        const categoryField = {};
        const categoryKey = c.name.replace(' ', '_').toLowerCase();
        categoryField[categoryKey] = c.categoryItems.map(ci => ci.name);

        return categoryField;
    }).reduce((props, cf) => Object.assign(props, cf), {});


    session.language = additionalProperties.language[0];
    session.topics = additionalProperties.topic;
    session.sessionType = additionalProperties['session_type'][0];
    session.sessionLevel = additionalProperties['session_level'][0];

    if (speakers) {
        const sessionIds: string[] = sessionRaw.speakers.map(s => s.id);
        const speakersFound = speakers.filter(({ id }) => sessionIds.includes(id));
        session.speakers = speakersFound;
    }

    return session;
}

export async function getSpeakers(includeSessions: boolean = false): Promise<Speaker[]> {
    const speakersResult: any[] = await SessionizeApi.get('Speakers');
    const sessions = includeSessions ? await getSessions() : null;
    const speakers: Speaker[] = speakersResult.map(s => parseSpeaker(s, sessions));

    return speakers;
}


function parseSpeaker(speakerRaw: any, sessions: SessionInfo[] | null) {

    const speakerSlug = `${speakerRaw.firstName.toLowerCase()}-${speakerRaw.lastName.toLowerCase()}`
        .replaceAll(' ', '-')
        .replaceAll(/[.'/":*+?^${}()|[\]\\,“”!]/g, '')
        .replaceAll(/-{2,}/g, '-');

    const speaker: Speaker = {
        id: speakerRaw.id,
        slug: speakerSlug,
        firstName: speakerRaw.firstName,
        lastName: speakerRaw.lastName,
        fullName: speakerRaw.fullName,
        bio: speakerRaw.bio,
        tagLine: speakerRaw.tagLine,
        profilePicture: speakerRaw.profilePicture ?? defaultProfileImage,
        links: { websites: [] }
    };

    if (speakerRaw.links) {
        (speakerRaw.links as any[]).forEach(link => {
            const linkType = link.linkType.toLowerCase();

            switch (linkType) {
                case 'linkedin':
                    speaker.links.linkedin = link.url;
                    break;
                case 'twitter':
                    speaker.links.twitter = link.url;
                    break;
                case 'github':
                    speaker.links.github = link.url;
                    break;
                case 'facebook':
                    speaker.links.facebook = link.url;
                    break;
                case 'instagram':
                    speaker.links.instagram = link.url;
                    break;
                case 'company_website':
                    speaker.links.company = link.url;
                    break;
                case 'blog':
                default:
                    speaker.links.websites?.push(link.url);
                    break;


            }
        });


    }

    if (sessions) {
        const sessionIds: string[] = speakerRaw.sessions.map(s => s.id.toString());
        const sessionsFound = sessions.filter(({ id }) => sessionIds.includes(id));
        speaker.sessions = sessionsFound;
    }

    return speaker;
}