import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const userAgent = request.get('user-agent') || '';
    const now = Date.now();

    this.logger.log(`→ ${method} ${url} [${userAgent}]`);

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode as number;
        const elapsed = Date.now() - now;
        this.logger.log(`← ${method} ${url} ${statusCode} ${elapsed}ms`);
      }),
    );
  }
}
