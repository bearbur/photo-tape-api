export interface AuthTokenFindResultUnit {
    user_token: string;
    inactive: boolean;
    expiration_date: number;
}

export interface AuthTokenFindResult {
    [key: number]: AuthTokenFindResultUnit;
}
