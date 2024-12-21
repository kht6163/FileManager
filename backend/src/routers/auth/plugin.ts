import { Elysia } from "elysia";
import { loginRouter } from "./login";
import { logoutRouter } from "./logout";
import { createUserRouter } from "./createUser";

export const authPlugin = new Elysia({
    prefix: '/api/v1/auth',
    tags: ['auth']
})
    .use(loginRouter)
    .use(createUserRouter)
    .use(logoutRouter)