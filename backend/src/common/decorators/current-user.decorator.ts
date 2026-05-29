import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SafeUser } from '../../models/user.model';

export const CurrentUser = createParamDecorator(
  (data: keyof SafeUser | undefined, ctx: ExecutionContext): SafeUser | string => {
    const request = ctx.switchToHttp().getRequest();
    const user: SafeUser = request.user;
    return data ? (user[data] as string) : user;
  },
);
