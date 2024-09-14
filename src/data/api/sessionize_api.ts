import type { ScheduleDay, SessionInfo, Speaker } from "../types/sessionize";

const API_ID = "1rh747m6"
const API_ENDPOINT = `https://sessionize.com/api/v2/${API_ID}`;
const defaultProfileImage = "/assets/vectors/user_circle.svg"

async function SessionizeGET(method: string): Promise<any> {
    const url = `${API_ENDPOINT}/view/${method}`;
    const result = await fetch(url);
    const response = await result.text();
    const object = JSON.parse(response);

    return object;
}

export async function getSchedule(): Promise<Promise<ScheduleDay[]>> {
    const sessionsInfo = await getSessions(true);
    const schedule: ScheduleDay[] = await SessionizeGET('GridSmart');

    schedule.forEach(
        day => day.timeSlots.forEach(
            slot => slot.rooms.forEach(
                room => {
                    const sessionInfoFound = sessionsInfo.find((_s) => _s.id == room.session.id);
                    room.session.info = sessionInfoFound;
                },
            ),
        ),
    );

    return schedule;
}

export async function getSessions(includeSpeakers: boolean = false): Promise<SessionInfo[]> {
    const sessionResult: any[] = await SessionizeGET('Sessions');
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
        startsAt: sessionRaw.startsAt,
        endsAt: sessionRaw.endsAt,
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
    const speakersResult: any[] = await SessionizeGET('Speakers');
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
                    speaker.links.websites.push(link.url);
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