import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/entities/enums/user-role.enum';

export const seedUsers = async (dataSource: DataSource) => {
    const userRepository = dataSource.getRepository(User);

    const date = new Date().getTime();
    const admin: User = {
        id: 1,
        username: 'admin',
        password: await bcrypt.hash('adminpass', 10),
        role: UserRole.ADMIN,
        createdAt: date,
        lastUpdatedAt: date,
    };

    const user1: User = {
        id: 2,
        username: 'user1',
        password: await bcrypt.hash('user1pass', 10),
        role: UserRole.CUSTOMER,
        createdAt: date,
        lastUpdatedAt: date,
    };

    const user2: User = {
        id: 3,
        username: 'user2',
        password: await bcrypt.hash('user2pass', 10),
        role: UserRole.CUSTOMER,
        createdAt: date,
        lastUpdatedAt: date,
    };

    await userRepository.save([admin, user1, user2]);
};
