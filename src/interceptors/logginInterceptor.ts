import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import {Request, Response} from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();

        const req = context.switchToHttp().getRequest<Request>();
        const res = context.switchToHttp().getResponse<Response>();

        // https://gist.github.com/leereamsnyder/3df5ce766f06841745bc <-- Объяснение
        const wanstHtml = req.accepts(['html', 'json']) === 'html';

        const url = req.originalUrl;
        const method = req.method;

        return next.handle().pipe(
            tap((data) => {
                const elapsed = Date.now() - now;
                console.log(`[${method}] Request to ${url} took ${elapsed}ms`);

                if (!res.headersSent) {
                    res.setHeader('X-Elapsed-Time', `${elapsed}ms`);
                }
                if (wanstHtml && data && typeof data === 'object') {
                    data.elapsedTime =`${elapsed}ms`;
                }
            }),
        );
    }
}