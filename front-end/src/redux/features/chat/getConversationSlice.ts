import { createSlice } from "@reduxjs/toolkit";

export type TConversation = {
    lastMessage: string,
    participant: string,
    timestamp: string,
    _id: string,
    img: string,
    name: string,
    time: string
}
const initialState: TConversation[] = []
const conversationSlice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {
        setConversation: (state, action) => {
            console.log('payload', action.payload)
            state.push(action.payload)
            console.log(state)
        }
    }

})


export const { setConversation } = conversationSlice.actions
export default conversationSlice.reducer