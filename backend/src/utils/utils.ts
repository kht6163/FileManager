import { Elysia, t } from "elysia";
import { jwtAccessTokenSetup, jwtRefreshTokenSetup } from "./setupJWT";
import { ERROR_CODE } from "../../../enum/error_code";

export class MyError extends Error {
    constructor(public code: number, public message: string, public data: any) {
        super(message);
        this.code = code;
        this.data = data;
    }
}

export const hashPassword = (pwd: string) => Bun.password.hash(pwd, {
    algorithm: 'argon2id', // "argon2id" | "argon2i" | "argon2d"
    memoryCost: 1024 * 64, // memory usage in kibibytes
    timeCost: 5, // the number of iterations
});

export const checkJWT = (app: Elysia) =>
    app
        .use(jwtAccessTokenSetup)
        .use(jwtRefreshTokenSetup)
        .derive(
            async function checkJWT({ jwtAccessToken, jwtRefreshToken, cookie: { access_jwt, refresh_jwt } }) {
                const accessTokenResult = await jwtAccessToken.verify(access_jwt.value)

                if (!accessTokenResult) {
                    const refreshTokenResult = await jwtRefreshToken.verify(refresh_jwt.value);
                    if (!refreshTokenResult) {
                        return {
                            jwtState: false,
                            userId: 'undefined'
                        };
                    } else {
                        access_jwt.set({
                            value: await jwtAccessToken.sign({ id: refreshTokenResult.id }),
                            httpOnly: false,
                            maxAge: Number(process.env.JWT_ACCESS_EXPIRE),
                            secure: process.env.NODE_ENV === 'production'
                        });
                        return {
                            jwtState: true,
                            userId: refreshTokenResult.id
                        };
                    }
                } else {
                    return {
                        jwtState: true,
                        userId: accessTokenResult.id
                    };
                }
            }
        )
        .guard({
            beforeHandle({ set, jwtState }) {
                if (!jwtState) {
                    set.status = 401;
                    return {
                        code: 401,
                        message: ERROR_CODE.UNAUTHORIZED
                    };
                }
            }
        })


