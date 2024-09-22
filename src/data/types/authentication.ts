export type CheckTokenResponse = {
    status: boolean;
    errorMessage: string | null;
}

export type SignupResponse = {
    status: boolean;
    errorMessage: string | null;
}

export type SignUpException = {
    message: string;
}