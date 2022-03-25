import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { Role, User } from 'src/users/schema/user.schema';

const RoleGuard = (roles: Role[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const user = request.user as User;

      return roles.some((el) => el === user.role);
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
