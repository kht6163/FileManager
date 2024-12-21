import { t } from "elysia";

export const customResponse = {
    401: t.Object({
        message: t.String({ example: 'Unauthorized' }),
    }),
    422: t.Object({
        message: t.String({ example: 'Unprocessable Entity' }),
    }),
    500: t.Object({
        message: t.String({ example: 'Internal Server Error' }),
    }),
}