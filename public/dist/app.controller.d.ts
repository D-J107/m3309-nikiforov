import { SessionRequest } from './types/sessionRequest';
export declare class AppController {
    home(req: SessionRequest): {
        username: string | null;
    };
    personalAccount(req: SessionRequest): {
        username: string | null;
    };
    businessPartners(req: SessionRequest): {
        username: string | null;
    };
    contacts(req: SessionRequest): {
        username: string | null;
    };
    delivery(req: SessionRequest): {
        username: string | null;
    };
    payment(req: SessionRequest): {
        username: string | null;
    };
    reviews(req: SessionRequest): {
        username: string | null;
    };
    vacancy(req: SessionRequest): {
        username: string | null;
    };
}
