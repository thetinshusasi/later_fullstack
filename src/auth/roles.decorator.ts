import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/models/enums/user-role.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
