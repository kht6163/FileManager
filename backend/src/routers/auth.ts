import {Elysia, t} from "elysia";
import {jwt} from "@elysiajs/jwt";
import {pgPool} from "../utils/postgres";
import Bun from "bun";

const JWT_EXPIRY = 7 * 86400; // 7일
const hasher: Bun.CryptoHasher = new Bun.CryptoHasher("sha256")

export const login = new Elysia({
    prefix: '/api/auth',
    tags: ['auth']
})
    .use(pgPool)
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRETS || 'defaultSecret'
        })
    )
    .post('/login', async function login({body: {id, pwd}, pgPool, error, jwt, cookie: {access, refresh}}) {
        const conn = await pgPool.getPool();
        
        const result = await conn.query(
            'SELECT id FROM users WHERE id = $1 AND pwd = $2',
            [id, hasher.update(pwd).digest('hex')]
        );

        const token = await jwt.sign({ 
            id: result.rows[0].id,
            exp: Math.floor(Date.now() / 1000) + JWT_EXPIRY
        });

        const cookieOptions = {
            httpOnly: true,
            maxAge: JWT_EXPIRY,
            secure: process.env.NODE_ENV === 'production'
        };

        access.set({ value: token, ...cookieOptions });
        refresh.set({ value: token, ...cookieOptions });

        return 'success';
    }, {
        body: t.Object({
            id: t.String({
                minLength: 1,
                description: 'user id',
                examples: ['admin']
            }),
            pwd: t.String({
                minLength: 1,
                description: 'user password',
                examples: ['admin']
            })
        }),
        detail: {
            summary: 'login',
        },
        response: {
            200: t.String(
                {
                    examples: ['success'],
                    description: 'success'
                }),
            400: t.Object({
                error: t.String()
            })
        }
    })