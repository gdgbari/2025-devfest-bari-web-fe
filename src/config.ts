import { redirectUrl } from "./scripts/utils";

export class WebsiteConfig {
    /*--------------------------------------------
    |              GENERAL SETTINGS              |  
    --------------------------------------------*/
    
    public static readonly DEVFEST_NAME: string = 'Devfest Bari 2024';
    public static readonly DEVFEST_LOGO_LIGHT: string = '/assets/images/logo_light.webp';
    public static readonly DEVFEST_LOGO_DARK: string = '/assets/images/logo_dark.webp';
    public static readonly DEVFEST_EVENT_LINK: string = redirectUrl('https://gdg.community.dev/e/mnr6ek/');
    public static readonly DEVFEST_THEME_COLOR: string = '#f59e0b';

    /*--------------------------------------------
    |              EVENT INFO                    |  
    --------------------------------------------*/

    public static readonly EVENT_START : Date = new Date('2024-10-26');
    public static readonly EVENT_END : Date = new Date('2024-10-26');
    public static readonly EVENT_LOCATION_NAME : String = 'Polythecnic of Bari';
    public static readonly EVENT_LOCATION_CITY : String = 'Bari';
    public static readonly EVENT_LOCATION_ADDRESS : String = 'Via Edoardo Orabona 4';
    public static readonly EVENT_LOCATION_FULL_ADDRESS : String = ` ${this.EVENT_LOCATION_ADDRESS}, 70126 Bari BA`;

    
    /*--------------------------------------------
    |              SOCIAL SHARE                  |  
    --------------------------------------------*/

    public static readonly TWITTER_SOCIAL_TEXT : string = 'Devfest Bari 2024 {url}';
    public static readonly TELEGRAM_MESSAGE_TEXT : string = 'Devfest Bari 2024';

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

}