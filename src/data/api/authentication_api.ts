import type { CheckTokenResponse, SignupResponse } from "../types/authentication";

export class AuthenticationApi {
    async checkToken(token: string): Promise<CheckTokenResponse> {
        return { status: true, errorMessage: null };
    }

    async signInWithEmailAndPassword(email: string, password: string): Promise<SignupResponse> {
        return { status: true, errorMessage: null };
    }
}