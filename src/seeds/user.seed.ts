import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/models/enums/user-role.enum';

export const seedUsers = async (dataSource: DataSource) => {
    const userRepository = dataSource.getRepository(User);

    const date = new Date().getTime();

    const usersData = [
        { id: 1, username: 'admin1', password: 'adminpass', role: UserRole.ADMIN },
        { id: 2, username: 'user1', password: 'user1pass', role: UserRole.CUSTOMER },
        { id: 3, username: 'user2', password: 'user2pass', role: UserRole.CUSTOMER }
    ];
    for (let userData of usersData) {
        let user = await userRepository.findOne({ where: { username: userData.username } });

        if (!user) {
            user = new User();
        }

        user.username = userData.username;
        user.password = await bcrypt.hash(userData.password, 10);
        user.role = userData.role;
        user.createdAt = user.createdAt || date;
        user.lastUpdatedAt = date;

        await userRepository.save(user);
    }
};
