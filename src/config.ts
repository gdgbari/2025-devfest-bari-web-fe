import { redirectUrl } from "./helpers/redirect_url";

export class WebsiteConfig {
    /*--------------------------------------------
    |              GENERAL SETTINGS              |  
    --------------------------------------------*/
    
    public static readonly DEVFEST_NAME: string = 'Devfest Bari 2025';
    public static readonly DEVFEST_LOGO_LIGHT: string = '/assets/images/logo_light.webp';
    public static readonly DEVFEST_LOGO_DARK: string = '/assets/images/logo_dark.webp';
    public static readonly DEVFEST_EVENT_LINK: string = redirectUrl('https://gdg.community.dev/events/details/google-gdg-bari-presents-devfest-bari-2025/');
    public static readonly DEVFEST_WEBSITE_LINK: string = 'https://bari.devfest.it';
    public static readonly ALLOWED_REDIRECT_HOSTS = [
        "bari.devfest.it",
        "dev.devfest.it",
        "gdg.community.dev"
    ]
    public static readonly DEVFEST_THEME_COLOR: string = '#f59e0b';

    /*--------------------------------------------
    |              EVENT INFO                    |  
    --------------------------------------------*/

    public static readonly EVENT_START : Date = new Date("2025-11-29T09:00:00+01:00");
    public static readonly EVENT_END : Date = new Date("2025-11-29T19:00:00+01:00");
    public static readonly EVENT_TIMEZONE : string = 'Europe/Rome';
    public static readonly EVENT_LOCATION_NAME : String = 'Polythecnic of Bari';
    public static readonly EVENT_LOCATION_CITY : String = 'Bari';
    public static readonly EVENT_LOCATION_ADDRESS : String = 'Via Edoardo Orabona 4';
    public static readonly EVENT_LOCATION_FULL_ADDRESS : String = ` ${this.EVENT_LOCATION_ADDRESS}, 70126 Bari BA`;

    
    /*--------------------------------------------
    |              SOCIAL SHARE                  |  
    --------------------------------------------*/

    public static readonly TWITTER_SOCIAL_TEXT : string = 'Devfest Bari 2025 {url}';
    public static readonly TELEGRAM_MESSAGE_TEXT : string = 'Devfest Bari 2025';

    /*--------------------------------------------
    |              SOCIAL PAGES                  |  
    --------------------------------------------*/

    public static readonly FACEBOOK_PAGE : string = 'https://www.facebook.com/GDGBari';
    public static readonly MEETUP_PAGE : string = '';
    public static readonly INSTAGRAM_PAGE : string = 'https://www.instagram.com/gdgbari/';
    public static readonly LINKEDIN_PAGE : string = 'https://www.linkedin.com/company/gdgbari/';
    public static readonly TELEGRAM_SPEAKERS_GROUP : string = 'https://t.me/+FFIAMECGZGVjNmU0';
    public static readonly WEBSITE : string = 'https://gdg.community.dev/gdg-bari/';

    /*--------------------------------------------
    |              NUMBERS INFO                  |  
    --------------------------------------------*/

    public static readonly NUM_PARTECIPENTS : number = 700;
    public static readonly NUM_TRACKS_FALLBACK : number = 7;

    public static readonly SESSIONIZE_API_KEY = "1rh747m6";

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    public static readonly FIREBASE_CONFIG = {
        apiKey: "AIzaSyDiPsb6Iw_JSB5dGZmwOflGbk8ndfMz9xw",
        authDomain: "devfest-bari-24-app.firebaseapp.com",
        databaseURL: "https://devfest-bari-24-app-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "devfest-bari-24-app",
        storageBucket: "devfest-bari-24-app.appspot.com",
        messagingSenderId: "33508282460",
        appId: "1:33508282460:web:fa730002a967adbb5a5699",
        measurementId: "G-7M75EC4PZB"
    };

}