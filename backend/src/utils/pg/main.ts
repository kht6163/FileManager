import pg from 'pg';

export class pgDatabase {
    private pool: pg.Pool;

    constructor() {
        this.pool = new pg.Pool({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });
    }

    public async getPool() {
        return await this.pool.connect();
    }
}