import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../../users/entities/user.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly refletor: Reflector
  ) {

  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.refletor.get(META_ROLES, context.getHandler());

    if (!validRoles) {
      return true;
    }

    if (validRoles.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) {
      throw new BadRequestException('User not found');
    }

    for (const role of user.roles) {
      if (validRoles.includes(role.name)) {
        return true;
      }

    }
    throw new ForbiddenException(
      `User ${user.username} need a valid role: [${validRoles}]`
    );
  }
}
