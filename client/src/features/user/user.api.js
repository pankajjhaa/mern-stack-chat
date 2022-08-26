import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://127.0.0.1:5000/',
        prepareHeaders: (headers, {getState}) => {
            const {token} = JSON.parse(getState().persistedReducer.user.userInfo)
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }

            return headers
        },
    }),
    tagTypes: 'User',
    endpoints: (build) => ({
        getSearchUser: build.query({
            query: (search=null) => ({
                url:  `api/user?search=${search}`,
                method: 'GET'
            }),
            invalidatesTags: 'User',
        }),
    })
})

export const {useGetSearchUserQuery} = userApi
