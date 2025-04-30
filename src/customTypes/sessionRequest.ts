import { Request } from "express";
import session from "express-session";

export interface SessionRequest extends Request {
    session: session.Session & Partial<session.SessionData> & {
        user?: {username: string, email: string};
    };
}