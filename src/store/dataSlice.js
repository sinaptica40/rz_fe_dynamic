import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    userdata: null
}


const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setUserDetails(state, action){
            state.userdata = action.payload 
        }
    }
})

export const {
    setUserDetails
} = dataSlice.actions
export default dataSlice.reducer