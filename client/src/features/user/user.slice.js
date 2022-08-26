import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    userInfo: [],
}


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userInfo.push(action.payload)
        },
        removeUser: (state) => {
            state.userInfo.splice(0,state.userInfo.length)
        }
    }
})

export const { setUser, removeUser } = userSlice.actions

export default userSlice.reducer
