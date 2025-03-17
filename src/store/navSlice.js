import {createSlice} from '@reduxjs/toolkit'


const initialState = {
    navPages: []
}


const navSlice = createSlice({
    name: "nav",
    initialState,
    reducers:{
        setNavPages: (state, action) =>{
            state.navPages = action.payload
        }
    }
})

export const {setNavPages} = navSlice.actions;
export default navSlice.reducer;