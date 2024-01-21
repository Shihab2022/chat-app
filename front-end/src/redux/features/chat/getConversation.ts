import { baseApi } from "../../api/baseApi"



const conversationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getConversation: builder.query({
            query: (id) => ({
                url: `/invite/getConversation/${id}`,
                method: 'GET',
            })
        }),
        getMessage: builder.mutation({
            query: (userInfo) => ({
                url: "/message/getMessage",
                method: 'POST',
                body: userInfo
            })
        }),
    })
})

export const { useGetConversationQuery, useGetMessageMutation } = conversationApi