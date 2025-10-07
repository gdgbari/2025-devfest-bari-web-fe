import { WebsiteConfig } from "../../config";
import { SessionizeApi } from "../api/sessionize_api";
import type { ScheduleDay, SessionInfo, Speaker } from "../types/sessionize";

const defaultProfileImage = "/assets/vectors/user_circle.svg"

/**
 * Debug helper: Forces a date to today while preserving the original time
 */
function forceToToday(originalDateString: string): string {
    if (!WebsiteConfig.DEBUG_FORCE_EVENT_TODAY) {
        return originalDateString;
    }
    
    console.log(`🔧 DEBUG: Processing date ${originalDateString}`);
    
    const originalDate = new Date(originalDateString);
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
    
    console.log(`🔧 DEBUG: Original: ${originalDateString} -> Forced: ${forcedDateString}`);
    
    return forcedDateString;
}

export async function getSchedule(): Promise<Promise<ScheduleDay[]>> {
    console.log('🔄 Loading schedule data...');
    const sessionsInfo = await getSessions(true);
    const schedule: ScheduleDay[] = await SessionizeApi.get('GridSmart');

    console.log(`📊 Schedule loaded with ${schedule.length} days`);

    schedule.forEach(
        (day, dayIdx) => {
            console.log(`📅 Processing day ${dayIdx + 1} with ${day.timeSlots.length} time slots`);
            
            // Apply debug date forcing to the day itself if enabled
            if (WebsiteConfig.DEBUG_FORCE_EVENT_TODAY) {
                const originalDate = day.date;
                day.date = forceToToday(day.date);
                console.log(`📅 DEBUG: Day date ${originalDate} -> ${day.date}`);
            }
            
            day.timeSlots.forEach((slot, slot_idx) => {
                // Apply debug date forcing if enabled
                if (WebsiteConfig.DEBUG_FORCE_EVENT_TODAY) {
                    console.log(`🔧 DEBUG: Processing slot ${slot_idx + 1} with ${slot.rooms.length} rooms`);
                    
                    slot.rooms.forEach((room, roomIdx) => {
                        const originalStart = room.session.startsAt;
                        const originalEnd = room.session.endsAt;
                        
                        room.session.startsAt = forceToToday(room.session.startsAt);
                        room.session.endsAt = forceToToday(room.session.endsAt);
                        
                        console.log(`🏠 Room ${roomIdx + 1}: ${originalStart} -> ${room.session.startsAt}`);
                    });
                }
                
                day.timeSlots[slot_idx].slotStart = new Date(slot.rooms[0].session.startsAt).toLocaleString("it", {timeZone: WebsiteConfig.EVENT_TIMEZONE, hour:"numeric", minute:"numeric"})
                
                slot.rooms.forEach(
                    room => {
                        const sessionInfoFound = sessionsInfo.find((_s) => _s.id == room.session.id);
                        room.session.info = sessionInfoFound;
                    },
                )
            });
        },
    );

    console.log('✅ Schedule processing completed');
    return schedule;
}

export async function getSessions(includeSpeakers: boolean = false): Promise<SessionInfo[]> {
    const sessionResult: any[] = await SessionizeApi.get('Sessions');
    const speakers = includeSpeakers ? await getSpeakers() : null;
    const sessionsRaw: any[] = sessionResult[0].sessions;

    const sessions = sessionsRaw.map(s => parseSession(s, speakers));

    // Debug logging
    if (WebsiteConfig.DEBUG_FORCE_EVENT_TODAY) {
        console.log('🐛 DEBUG MODE: Forcing all event dates to today for testing');
        console.log(`📅 Today is: ${new Date().toLocaleDateString('it-IT')} (${new Date().toISOString()})`);
        console.log(`📊 Total sessions processed: ${sessions.length}`);
        
        if (sessions.length > 0) {
            console.log(`🕐 First session original dates:`, sessionsRaw[0].startsAt, '->', sessionsRaw[0].endsAt);
            console.log(`🕐 First session forced dates:`, sessions[0].startsAt, '->', sessions[0].endsAt);
            console.log(`🕐 First session formatted: ${new Date(sessions[0].startsAt).toLocaleString('it-IT')}`);
        }
        
        // Log a few session examples
        sessions.slice(0, 3).forEach((session, i) => {
            console.log(`📝 Session ${i + 1}: ${session.title} - ${new Date(session.startsAt).toLocaleString('it-IT')}`);
        });
    }

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