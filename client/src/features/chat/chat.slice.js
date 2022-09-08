import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    selectedChat: null, fetchAgain: false
}


const searchSlice = createSlice({
    name: 'chatSlice',
    initialState,
    reducers: {
        selectedChat: (state, action) => {
            state.selectedChat = action.payload
        },
        fetchChatAgain: (state, action) => {
            state.fetchAgain = action.payload
        }
    }
})

export const {selectedChat, fetchChatAgain} = searchSlice.actions

export default searchSlice.reducer
