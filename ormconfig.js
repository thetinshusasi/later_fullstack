require('dotenv').config({
    path: `.env.${process.env.NODE_ENV || 'development'}`,
});

module.exports = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +process.env.DB_PORT || 5433,
    username: process.env.DB_USERNAME || 'nest_user',
    password: process.env.DB_PASSWORD || 'nest_password',
    database: process.env.DB_NAME || 'nest_db',
    entities: ['src/**/*.entity{.ts,.js}'],
    migrations: ['src/migrations/*{.ts,.js}'],
    cli: {
        migrationsDir: 'src/migrations',
    },
    synchronize: false,
};
