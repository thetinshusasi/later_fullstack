import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/entities/enums/user-role.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
