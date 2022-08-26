import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'auth',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://127.0.0.1:5000/'
    }),
    tagTypes: 'Auth',
    endpoints: (build) => ({
        signUp: build.mutation({
            query: (user) => ({
                url: 'api/user/register',
                method: 'POST',
                body: user,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }),

        }),
        login: build.mutation({
            query: (user) => (  {
                url: 'api/user/login',
                method: 'POST',
                body: user,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }),
            invalidatesTags: 'Auth',
        }),
    })
})

export const {useSignUpMutation, useLoginMutation} = authApi
