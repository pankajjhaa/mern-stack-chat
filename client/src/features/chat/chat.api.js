import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const chatApi = createApi({
    // The unique key that defines where the Redux store will store our cache.
    reducerPath: 'chat',
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
    endpoints: (build) => ({
        getAllChats: build.query({
            query: () => ({
                url: 'api/chats',
                method: 'GET'
            })
        }),

        accessChats: build.mutation({
            query: (body) => ({
                url: 'api/chats',
                method: 'POST',
                body,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            })
        }),
        createGroupChat: build.mutation({
            query: (body) => ({
                url: 'api/chats/createGroupChat',
                method: 'POST',
                body,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            })
        }),
        sendMessage: build.mutation({
            query: (body) => ({
                url: 'api/message',
                method: 'POST',
                body,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            })
        }),
        fetchMessage: build.query({
            query: (chatId) => ({
                url: `api/message/${chatId}`,
                method: 'GET',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            })
        }),

    })
})

export const {useGetAllChatsQuery, useAccessChatsMutation, useCreateGroupChatMutation, useFetchMessageQuery,  useSendMessageMutation} = chatApi
