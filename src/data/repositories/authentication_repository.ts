import { AuthenticationApi } from "../api/authentication_api";
import type { SignUpException } from "../types/authentication";

export class AuthenticationRepository {
    api: AuthenticationApi;

    constructor() {
        this.api = new AuthenticationApi();
    }

    async checkToken(token: string): Promise<boolean> {
        const result = await this.api.checkToken(token);
        return result.status;
    }

    async signInWithEmailAndPassword(email: string, password: string): Promise<void> {
        const result = await this.api.signInWithEmailAndPassword(email, password);

        if (!result.status) {
            throw {
                message: result.errorMessage
            } as SignUpException;
        }
    }
}