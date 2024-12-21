import { Elysia, t } from "elysia";
import { customResponse } from "../../utils/customResponse";

export const logoutRouter = new Elysia()
    .get('/logout', async function logout({ set, cookie: { access_jwt, refresh_jwt } }) {
        access_jwt.remove();
        refresh_jwt.remove();
        return { message: 'success' }
    }, {
        detail: {
            description: '로그아웃 API',
        },
        response: {
            200: t.Object({
                message: t.String({
                    examples: ['success']
                })
            })
        }
    })