import { Elysia, t } from "elysia";
import { pgPool } from "../../utils/postgres";
import { customResponse } from "../../utils/customResponse";
import { jwtAccessTokenSetup, jwtRefreshTokenSetup } from "../../utils/setupJWT";


export const loginRouter = new Elysia()
    .use(pgPool)
    .use(jwtAccessTokenSetup)
    .use(jwtRefreshTokenSetup)
    .post('/login', async function login({ set, pgPool, jwtAccessToken, jwtRefreshToken, body: { id, pwd }, cookie: { access_jwt, refresh_jwt } }) {
        console.log(id, pwd);

        const result = await pgPool.login(id, pwd);

        if (result.state) {
            const accessJWT = await jwtAccessToken.sign({ id: result.data.id });
            const refreshJWT = await jwtRefreshToken.sign({ id: result.data.id });

            console.log(Number(process.env.JWT_ACCESS_EXPIRE), Number(process.env.JWT_REFRESH_EXPIRE));

            access_jwt.set({
                value: accessJWT,
                httpOnly: false,
                maxAge: Number(process.env.JWT_ACCESS_EXPIRE),
                expires: new Date(Date.now() + Number(process.env.JWT_ACCESS_EXPIRE) * 1000),
                secure: process.env.NODE_ENV === 'production'
            });

            refresh_jwt.set({
                value: refreshJWT,
                httpOnly: true,
                maxAge: Number(process.env.JWT_REFRESH_EXPIRE),
                expires: new Date(Date.now() + Number(process.env.JWT_REFRESH_EXPIRE) * 1000),
                secure: process.env.NODE_ENV === 'production'
            });

            return { message: 'success' }
        } else {
            return { state: false, code: result.code, message: result.message }
        }
    }, {
        detail: {
            description: '로그인 API',
        },
        body: t.Object({
            id: t.String({
                examples: ['admin']
            }),
            pwd: t.String({
                examples: ['admin']
            })
        }),
        response: {
            200: t.Object({
                message: t.String({
                    examples: ['success']
                })
            }),
            ...customResponse
        }
    });