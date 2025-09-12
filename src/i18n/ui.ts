import { WebsiteConfig } from "../config";
import { faqEng, faqIta } from "./faq";

export const languages = {
    en: 'English',
    it: 'Italiano',
};
export type LanguageCode = keyof typeof languages;
export const defaultLang = 'it';
export const showDefaultLang = false;

export const ui = {
    en: {
        'nav.home': 'Home',
        'nav.schedule': 'Schedule',
        'nav.sessions': 'Sessions',
        'nav.speakers': 'Speakers',
        'nav.location': 'Location',
        'nav.lang': 'Language',
        'nav.faq': 'Faq',
        'nav.team': 'Team',
        'nav.editions': 'Editions',
        'hero.ticketsAvailable': 'TICKETS AVAILABLE',
        'hero.photoAvailable': 'PHOTOS AVAILABLE',
        'footer.share': 'Share',
        'footer.followUs': 'Follow us',
        'info.locationName': WebsiteConfig.EVENT_LOCATION_NAME_ENG,
        'info.locationAddress': WebsiteConfig.EVENT_LOCATION_FULL_ADDRESS,
        'info.partecipants': 'Participants',
        'info.speakers': 'Speakers',
        'info.tracks': 'Tracks',
        'info.categories': 'Categories',
        'speaker.seeAll': 'See all speakers',
        'speaker.slides': 'Speakers slides',
        'ticket.title': 'Book your ticket now',
        'ticket.free': 'FREE',
        'ticket.cta': 'Get your ticket',
        'community.cta': 'Join us',
        'sessions.listTitle': 'Sessions',
        'sessions.shortMinutes': 'mins',
        'sessions.shortHours': 'hrs',
        'sessions.toBeAnnunced': 'To be annunced',
        'session.detailTitle': 'Session details',
        'session.speakers': 'Speakers',
        'session.topics.listTitle': 'Topics',
        'session.topics.topicSessionList': '$topic$\'s sessions',
        'speakers.listTitle': 'Speakers',
        'speakers.detailTitle': 'Speaker details',
        'speakers.sessionList': 'Sessions',
        'scheduling.noschedule': 'Schedule not available',
        'session.room': 'Room',
        'team.description': `
            Google is known all around the world. Everyone is 'googling', checking on
            'Maps' and communicating in 'Gmail'. For simple users, they are services
            that just works, but not for us. Developers see much more: APIs,
            scalability issues, complex technology stacks. And that is what GDG is
            about.
            </p>
            <p>
            <a href="https://gdg.community.dev/gdg-bari/"
                >Google Developers Group (GDG) Bari
            </a>- is open and volunteer geek community who create exciting projects
            and share experience about Google technologies with a passion.`,
        'location.description': `
            The conference will take place at the ${WebsiteConfig.EVENT_LOCATION_NAME_ENG}. ${WebsiteConfig.EVENT_LOCATION_CITY} is a
            small town, and you can easily walk around or rely on public
            transportation if you're coming from far away. The address of the venue
            is: ${WebsiteConfig.EVENT_LOCATION_FULL_ADDRESS}`,
        'location.howToGet': 'How to get there 🚶‍♂️',
        'location.byTrain': 'By train 🚄',
        'location.byTrainDesc': `
            Bari's railway station (Bari Centrale) is directly connected with Turin,
            Rome, Genova and Milan. There are connections that you can reach with a
            high-speed train (Freccia Rossa). The train schedule is available at the
            site of Trenitalia. Recall that in Italy, before getting on the train,
            you must stamp your ticket by using those small yellow machines
            available within the station. To reach the venue, you can take the city
            bus number 21 and get off at the bus stop in via Re David (stop called
            Re David (Politecnico)). Here you can find the directions on Google maps. As an
            alternative, the University is at walking distance from the railway
            station (approximately 20-30 minutes).
        `,
        'location.byCar': 'By car 🚗',
        'location.byCarDesc': `
            Bari is near the intersection of two highways: A14 Adriatica (Bologna -
            Taranto). Parking is a bit of a problem and most parking areas are with pay-meters. The
            nearest free parking to the venue is the Park & Ride LARGO 2 GIUGNO (8 minutes walk).
        `,
        'location.byPlane': 'By plane ✈️',
        'location.byPlaneDesc': `
            Bari has an international airport with daily flights to London and
            Munich, as well as to Rome, Milan, and other important Italian cities.
            The timetable of incoming and outgoing flights is available at the site
            of Bari airport. The airport is approximately 27 km from the center. The
            most convenient way to reach the center is probably by metro. You can take 
            the Ferrotramviaria Bari, a city train that connects Bari Airport to Bari 
            Railway Station (Bari Centrale), then take the city bus number 21 and get 
            off at the bus stop in via Re David.
        `,
        'faq.questions': faqEng,
        'redirect.instructions': `
            <p class="mb-2 underline">To access the ticket page:</p>
            <p class="underline">Tap the 3 dots above and select "Open in browser"</p>
        `,
        'redirect.redirecting': 'Redirecting...',
        'redirect.backToHome': 'Back to homepage',
        'redirect.ticketIssueTitle': 'Unable to access the ticket page?',
        'home.whatIsDevfestBariTitle': 'What is DevFest Bari?',
        'home.whatIsDevfestBari': `
            <b>DevFest Bari</b> is an annual event organized by the Google Developers
            Group of Bari, aimed at developers, technologists, and Google enthusiasts.
            The event will take place at the end of October and includes one day of
            inspiration, learning, and networking. Participants will be able to explore
            the latest technological innovations, with a focus on Android, Web and
            Cloud technologies, AI, among others.`,
        'home.photosTitle': 'Photos of DevFest Bari 2024',
        'home.officialPhotos': 'Officials',
        'home.communityPhotos': 'Community',
        'ticket.description': `
            Reserve your spot for ${WebsiteConfig.DEVFEST_NAME} and gain access to the
            conference including all talks and workshops.
        `,
        'ticket.schools': `
            <p class="mt-4 text-3xl mb-2 font-medium">Are you a high school?</p>
                <p>
                <a
                    href="https://forms.gle/NM2boABkkXr4R3N96">Contact us</a
                > to organize your participation.
                </p>
                <p class="mt-4 text-3xl font-medium mb-2">
                Are you a high school student?
                </p>
                <p>
                Talk to your teachers and have them contact us. If you want to
                participate independently, <a
                    href="https://gdg.community.dev/events/details/google-gdg-bari-presents-devfest-bari-2025/#QeHcv97kND"
                >Contact us</a
                > and we will assist you.
            </p>`,
        'ticket.checkFAQFirstPart': "Check out the",
        'ticket.checkFAQSecondPart': "for more information.",
        'home.whyPartecipateTitle': 'Why attend the DevFest?',
        'home.whyPartecipateLearningTitle': 'Learning',
        'home.whyPartecipateLearningDesc': `
            Learn directly from the brightest minds in tech and listen to experts
            from Google and emerging technologies.`,
        'home.whyPartecipateWorkshopsTitle': 'Hands-on Workshops',
        'home.whyPartecipateWorkshopsDesc': "Get hands-on with practical workshops and take home new skills.",
        'home.whyPartecipateNetworkingTitle': 'Networking',
        'home.whyPartecipateNetworkingDesc': `
            Create vital connections by expanding your network with professionals
            and enthusiasts like you.`,
        'home.theVenue': 'The venue',
        'home.theVenueDesc': "Located on the Bari University campus, it is known for its innovative and industry-oriented research.",
        'home.joinCommunity': 'Join the Community',
        'home.joinCommunityDesc': `
            Join us to be part of a growing community, improve your knowledge and
            skills, and find a welcoming space to be yourself. We offer a
            supportive environment, stimulating discussions, fun events, resource
            sharing, and networking opportunities.
        `,
        'speaker.comingSoon': "Speakers have not been announced yet... Stay tuned!",
    },
    it: {
        'nav.home': 'Home',
        'nav.schedule': 'Schedule',
        'nav.sessions': 'Sessioni',
        'nav.speakers': 'Speaker',
        'nav.location': 'Location',
        'nav.lang': 'Lingua',
        'nav.faq': 'Faq',
        'nav.team': 'Team',
        'nav.editions': 'Edizioni',
        'footer.share': 'Condividi',
        'footer.followUs': 'Seguici su',
        'info.locationName': WebsiteConfig.EVENT_LOCATION_NAME_ITA,
        'info.locationAddress': WebsiteConfig.EVENT_LOCATION_FULL_ADDRESS,
        'info.partecipants': 'Partecipanti',
        'info.speakers': 'Speaker',
        'info.tracks': 'Track',
        'info.categories': 'Categorie',
        'speaker.seeAll': 'Tutti gli speaker',
        'speaker.slides': 'Slides degli speaker',
        'hero.ticketsAvailable': 'BIGLIETTI DISPONIBILI',
        'hero.photoAvailable': 'FOTO DISPONIBILI',
        'ticket.title': 'Prenota ora il tuo biglietto',
        'ticket.free': 'GRATIS',
        'ticket.cta': 'Iscriviti',
        'community.cta': 'Unisciti',
        'sessions.listTitle': 'Sessioni',
        'sessions.shortMinutes': 'min',
        'sessions.shortHours': 'ore',
        'sessions.toBeAnnunced': 'Da annuncare',
        'session.detailTitle': 'Dettagli sessione',
        'session.speakers': 'Speaker',
        'session.topics.listTitle': 'Topic',
        'session.topics.topicSessionList': 'Sessioni su \'$topic$\'',
        'speakers.listTitle': 'Speaker',
        'speakers.detailTitle': 'Dettagli speaker',
        'speakers.sessionList': 'Sessioni',
        'scheduling.noschedule': 'Schedule non disponibile',
        'session.room': 'Aula',
        'team.description': `
            Google è conosciuto in tutto il mondo. Tutti fanno ricerche su Google,
            controllano su 'Maps' e comunicano su 'Gmail'. Per gli utenti comuni, sono
            servizi che semplicemente funzionano, ma non per noi. Gli sviluppatori
            vedono molto di più: API, problemi di scalabilità, stack tecnologici
            complessi. Ed è di questo che si occupa un GDG.
            </p>
            <p>
            <a href="https://gdg.community.dev/gdg-bari/"
                >Google Developers Group (GDG) Bari
            </a> è una comunità geek aperta e volontaria che crea progetti entusiasmanti
            e condivide esperienze sulle tecnologie di Google con passione.`,
        'location.description': `
            La conferenza si svolgerà presso ${WebsiteConfig.EVENT_LOCATION_NAME_ITA}. 
            ${WebsiteConfig.EVENT_LOCATION_CITY} è unapiccola città, e puoi 
            facilmente spostarti a piedi o affidarti ai mezzi pubblici se 
            vieni da lontano. L'indirizzo del luogo dell'evento è: 
            ${WebsiteConfig.EVENT_LOCATION_FULL_ADDRESS}`,
        'location.howToGet': 'Come raggiungerci 🚶‍♂️',
        'location.byTrain': 'Treno 🚄',
        'location.byTrainDesc': `
            La stazione ferroviaria di Bari (Bari Centrale) è direttamente collegata
            con Torino, Roma, Genova e Milano. Ci sono collegamenti che puoi
            raggiungere con un treno ad alta velocità (Freccia Rossa). L'orario dei
            treni è disponibile sul sito di Trenitalia. Ricorda che in Italia, prima
            di salire sul treno, devi convalidare il tuo biglietto utilizzando
            quelle piccole macchine gialle disponibili all'interno della stazione.
            Per raggiungere il luogo dell'evento, puoi prendere l'autobus cittadino
            numero 21 e scendere alla fermata in via Re David (fermata chiamata Re
            David (Politecnico)). Qui puoi trovare le indicazioni su Google maps. In
            alternativa, l'Università si trova a pochi passi dalla stazione
            ferroviaria (circa 20-30 minuti a piedi).
        `,
        'location.byCar': 'Auto 🚗',
        'location.byCarDesc': `
            Bari si trova vicino all'incrocio di due autostrade: A14 Adriatica
            (Bologna - Taranto). Il parcheggio è un po' problematico e la maggior
            parte delle aree di parcheggio sono a pagamento. Il parcheggio gratuito
            più vicino al luogo dell'evento è il Park & Ride LARGO 2 GIUGNO (8
            minuti a piedi).
        `,
        'location.byPlane': 'Aereo ✈️',
        'location.byPlaneDesc': `
            Bari ha un aeroporto internazionale con voli giornalieri per Londra e
            Monaco, così come per Roma, Milano e altre importanti città italiane.
            L'orario dei voli in arrivo e in partenza è disponibile sul sito
            dell'aeroporto di Bari. L'aeroporto si trova a circa 27 km dal centro.
            Il modo più comodo per raggiungere il centro è probabilmente in
            metropolitana. Puoi prendere il Ferrotramviaria Bari, un treno cittadino
            che collega l'aeroporto di Bari alla stazione ferroviaria di Bari (Bari
            Centrale), quindi prendere l'autobus cittadino numero 21 e scendere alla
            fermata dell'autobus in via Re David.
        `,
        'faq.questions': faqIta,
        'redirect.instructions': `
            <p class="mb-2 underline">Per accedere alla pagina del ticket:</p>
            <p class="underline">Tocca i 3 puntini sopra e seleziona "Apri nel browser"</p>
        `,
        'redirect.redirecting': 'Reindirizzamento in corso...',
        'redirect.backToHome': 'Torna alla homepage',
        'redirect.ticketIssueTitle': 'Non riesci ad accedere alla pagina del ticket?',
        'home.whatIsDevfestBariTitle': "Cos'è la DevFest Bari?",
        'home.whatIsDevfestBari': `
            La <b>DevFest Bari</b> è un evento annuale organizzato dal Google
            Developers Group di Bari, destinato a sviluppatori, tecnologi e appassionati
            del mondo Google. L'evento si terrà a fine ottobre e comprende un giorno
            di ispirazione, apprendimento e networking. Gli partecipanti potranno esplorare
            le ultime innovazioni tecnologiche, con un focus su Android, Web e Cloud
            technologies, AI, tra gli altri.`,
        'home.photosTitle': 'Foto della DevFest Bari 2024',
        'home.officialPhotos': 'Ufficiali',
        'home.communityPhotos': 'Community',
        'ticket.description': `
            Riserva il tuo posto per la ${WebsiteConfig.DEVFEST_NAME} ed avrai accesso alla
            conferenza comprensiva di tutti i talk e i workshop.
        `,
        'ticket.schools': `
            <p class="mt-4 text-3xl mb-2 font-medium">
                Sei una scuola superiore?
            </p>
            <p>
                <a
                href="https://forms.gle/NM2boABkkXr4R3N96"
                target="_blank"
                >Scrivici</a
                > per organizzare la vostra partecipazione.
            </p>
            <p class="mt-4 text-3xl font-medium mb-2">
                Sei uno studente delle scuole superiori?
            </p>
            <p>
                Parlane con con i tuoi professori e facci contattare da loro. Se
                invece vuoi partecipare in autonomia, <a
                target="_blank"
                href="https://gdg.community.dev/events/details/google-gdg-bari-presents-devfest-bari-2025/#QeHcv97kND"
                >Contattaci</a
                > e ti aiuteremo noi.
            </p>`,
        'ticket.checkFAQFirstPart': "Consulta le",
        'ticket.checkFAQSecondPart': "per saperne di più.",
        'home.whyPartecipateTitle': 'Perché partecipare alla DevFest?',
        'home.whyPartecipateLearningTitle': 'Imparare',
        'home.whyPartecipateLearningDesc': `
            Impara direttamente dalle menti più brillanti del tech e ascolta gli
            esperti del settore Google e delle tecnologie emergenti.`,
        'home.whyPartecipateWorkshopsTitle': 'Workshop Pratici',
        'home.whyPartecipateWorkshopsDesc': "Metti le mani in pasta con workshop pratici e porta a casa nuove competenze.",
        'home.whyPartecipateNetworkingTitle': 'Networking',
        'home.whyPartecipateNetworkingDesc': "Crea connessioni vitali espandendo la tua rete con professionisti e appassionati come te.",
        'home.theVenue': 'La Sede',
        'home.theVenueDesc': "Situato nel campus dell'Università di Bari, è noto per la sua ricerca innovativa e orientata all'industria.",
        'home.joinCommunity': 'Entra nella Community',
        'home.joinCommunityDesc': `
            Unisciti a noi per far parte di una comunità in crescita, migliorare
            la tua conoscenza e le tue competenze e trovare uno spazio accogliente
            per essere te stesso. Offriamo un ambiente di supporto, discussioni
            stimolanti, eventi divertenti, condivisione di risorse e opportunità
            di networking.
        `,
        'speaker.comingSoon': "Gli speaker non sono ancora stati annunciati... Resta sintonizzato!",
    },
} as const;