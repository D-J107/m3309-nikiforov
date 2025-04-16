
export interface UserJwtPayload {
    id: number;
    email: string;
    username?: string;
    roles: {
        id: number;
        value: string;
        description: string
    }[];
    iat: number;
    exp: number;
    [key: string]: any;
}