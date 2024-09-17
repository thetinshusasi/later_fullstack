import { UserRole } from "src/users/entities/enums/user-role.enum";

export default interface ITokenPayload {
    tokenId: number;
    username: string;
    userId: number;
    token: string;
    role: UserRole
    expiresAt: number;

}