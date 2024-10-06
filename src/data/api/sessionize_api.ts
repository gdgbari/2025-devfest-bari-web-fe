import { WebsiteConfig } from "../../config";
import type { ScheduleDay, SessionInfo, Speaker } from "../types/sessionize";

const API_ENDPOINT = `https://sessionize.com/api/v2/${WebsiteConfig.SESSIONIZE_API_KEY}`;

export class SessionizeApi {
    static async get(method: string): Promise<any> {
        const url = `${API_ENDPOINT}/view/${method}`;
        const result = await fetch(url);
        const response = await result.text();
        const object = JSON.parse(response);

        return object;
    }
}


