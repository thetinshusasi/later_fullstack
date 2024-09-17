import { UserRole } from "../../users/models/enums/user-role.enum";

interface IRequestContext {
    userId: number;
    username: string;
    role: UserRole;
    tokenId: number;
    exp: number;
}


export { IRequestContext };