import { baseApi } from "../../api/baseApi"



const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (userInfo) => ({
                url: "/user/create",
                method: 'POST',
                body: userInfo
            })
        }),
        login: builder.mutation({
            query: (userInfo) => ({
                url: "/user/login",
                method: 'POST',
                body: userInfo
            })
        }),
        forgetPassword: builder.mutation({
            query: (userInfo) => ({
                url: "/user/forget-password",
                method: 'POST',
                body: userInfo
            })
        }),
    })
})

export const { useRegisterMutation, useLoginMutation, useForgetPasswordMutation } = authApi