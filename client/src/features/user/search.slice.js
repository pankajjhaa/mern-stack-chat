import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    search: null
}


const searchSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        searchUser: (state, action) => {
            state.search = action.payload
        }
    }
})

export const { searchUser } = searchSlice.actions

export default searchSlice.reducer
