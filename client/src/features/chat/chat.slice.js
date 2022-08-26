import {createSlice} from '@reduxjs/toolkit'

const initialState = {
   selectedChat: null
}


const searchSlice = createSlice({
    name: 'chatSlice',
    initialState,
    reducers: {
        selectedChat: (state, action) => {
            state.selectedChat = action.payload
        }
    }
})

export const { selectedChat } = searchSlice.actions

export default searchSlice.reducer
