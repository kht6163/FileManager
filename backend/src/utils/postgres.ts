import {Elysia} from "elysia";
import pg from 'pg';


class pgDatabase {
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

    // 추가적인 메소드들을 여기에 작성할 수 있습니다. 예: 쿼리 실행 메소드
}

export const pgPool = new Elysia()
    .decorate({'pgPool': new pgDatabase()})