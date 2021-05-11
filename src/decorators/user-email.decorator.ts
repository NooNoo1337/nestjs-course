import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserEmail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    /**
     * req.user contains all properties
     * which returns validate function in JwtStrategy
     */
    return req.user;
  },
);
