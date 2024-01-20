import { baseApi } from "../../api/baseApi"



const conversationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getConversation: builder.query({
            query: () => ({
                url: "/invite/getConversation/659798b8df9f194773891c12",
                method: 'GET',
            })
        })
    })
})

export const { useGetConversationQuery } = conversationApi