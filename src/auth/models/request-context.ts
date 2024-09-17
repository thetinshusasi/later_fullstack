import { UserRole } from "src/users/models/enums/user-role.enum";

export interface IRequestContext {
    userId: number;
    username: string;
    role: UserRole;
    tokenId: number;
    exp: number;
}

