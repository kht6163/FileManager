import {Elysia, t} from "elysia";

class LoginItem {
    constructor(public id: string, public pwd: string) {
    }
}

export const login = new Elysia({
    prefix: '/api/auth',
    tags: ['auth']
})
    .post('/login', ({body: {id, pwd}, error}) => {
        console.log('id :', id, !id, !!id);
        console.log('pwd :', pwd, !pwd, !!pwd);



        return {token: 'test'}
    }, {
        body: t.Object({
            id: t.String({
                minLength: 1,
                description: 'user id'
            }),
            pwd: t.String({
                minLength: 1,
                description: 'user password'
            })
        }),
        detail: {
            summary: 'login',
        },
        response: {
            200: t.Object({
                token: t.String()
            }),
            400: t.Object({
                error: t.String()
            })
        }
    })