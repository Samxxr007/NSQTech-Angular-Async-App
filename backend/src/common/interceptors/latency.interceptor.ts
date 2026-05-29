import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class LatencyInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    const min = this.configService.apiDelayMin;
    const max = this.configService.apiDelayMax;
    const randomDelay = Math.floor(Math.random() * (max - min + 1)) + min;

    return next.handle().pipe(delay(randomDelay));
  }
}
