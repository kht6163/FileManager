import { Elysia, t } from "elysia";
import { customResponse } from "../../utils/customResponse";
import { pgPool } from "../../utils/postgres";
import { checkJWT } from "../../utils/utils";
import { ERROR_CODE } from "../../../../enum/error_code";

export const createUserRouter = new Elysia()
    .use(pgPool)
    .use(checkJWT)
    .post('/createUser', async function createUser({ set, pgPool, userId, body: { id, pwd, type } }) {
        if (await pgPool.isAdmin(userId)) {
            const result = await pgPool.createUser(id, pwd, type);
            if (result.state) {
                return { message: 'success' }
            } else {
                set.status = result.status;
                return { code: result.code, message: result.message }
            }
        } else {
            set.status = 401;
            return { code: ERROR_CODE.NOT_ADMIN, message: 'UNAUTHORIZED' }
        }
    }, {
        detail: {
            description: '사용자 생성 API',
        },
        body: t.Object({
            id: t.String({ examples: ["user_test", "admin_test"] }),
            pwd: t.String({ examples: ["test", "test"] }),
            type: t.Union([
                t.Literal(0),
                t.Literal(1)
            ], {
                description: '0: 관리자, 1: 일반유저',
                examples: [0, 1]
            })
        }),
        response: {
            200: t.Object({
                message: t.String({ examples: ["success"] })
            }),
            ...customResponse
        }
    })