import { ERROR_CODE } from "../../../../enum/error_code";
import { hashPassword } from "../utils";
import { pgDatabase } from "./main";

pgDatabase.prototype.isAdmin = async function (id: string) {
    const pool = await this.getPool();

    try {
        const result = await pool.query('SELECT type FROM users WHERE id = $1', [id]);

        if (result.rows.length === 1) {
            return result.rows[0].type === 0;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    } finally {
        pool.release();
    }
}

pgDatabase.prototype.login = async function (id: string, pwd: string) {
    const pool = await this.getPool();

    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

        if (result.rows.length === 1) {
            if (await Bun.password.verify(pwd, result.rows[0].pwd)) {
                return { state: true, data: result.rows[0] }
            } else {
                return { state: false, code: ERROR_CODE.NO_MATCH_ID_OR_PWD, message: 'NO_MATCH_ID_OR_PWD' }
            }
        } else {
            return { state: false, code: ERROR_CODE.NO_MATCH_ID_OR_PWD, message: 'NO_MATCH_ID_OR_PWD' }
        }
    } catch (error) {
        return { state: false, code: ERROR_CODE.INTERNAL_SERVER_ERROR, message: 'INTERNAL_SERVER_ERROR' }
    } finally {
        pool.release();
    }
}

pgDatabase.prototype.createUser = async function (id: string, pwd: string, type: 0 | 1 /* 0: 관리자, 1: 일반유저 */) {
    const pool = await this.getPool();

    try {
        const result = await pool.query('INSERT INTO users (id, pwd, type) VALUES ($1, $2, $3)', [id, await hashPassword(pwd), type]);

        return { state: true, message: 'success' }
    } catch (error: any) {

        if (error.code === '23505') {
            return { state: false, status: 400, code: ERROR_CODE.DUPLICATE_ID, message: 'DUPLICATE_ID' }
        } else {
            return { state: false, status: 500, code: ERROR_CODE.INTERNAL_SERVER_ERROR, message: 'INTERNAL_SERVER_ERROR' }
        }
    } finally {
        pool.release();
    }
}

declare module './main' {
    interface pgDatabase {
        isAdmin: (id: string) => Promise<boolean>;
        login: (id: string, pwd: string) => Promise<any>;
        createUser: (id: string, pwd: string, type: 0 | 1) => Promise<any>;
    }
}