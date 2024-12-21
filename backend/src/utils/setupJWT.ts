import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";

export const jwtAccessTokenSetup = new Elysia({
    name: "jwtAccessToken",
}).use(
    jwt({
        name: "jwtAccessToken",
        schema: t.Object({
            id: t.String(),
        }),
        secret: process.env.JWT_SECRET || 'defaultSecret',
        exp: `${process.env.JWT_ACCESS_EXPIRE}s` || '3600s',
    })
);

export const jwtRefreshTokenSetup = new Elysia({
    name: "jwtRefreshToken",
}).use(
    jwt({
        name: "jwtRefreshToken",
        schema: t.Object({
            id: t.String(),
        }),
        secret: process.env.JWT_SECRETS || 'defaultSecret',
        exp: `${process.env.JWT_REFRESH_EXPIRE}s` || '2592000s',
    })
);