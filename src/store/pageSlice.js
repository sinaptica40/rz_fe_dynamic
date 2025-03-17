import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isUpdateState: 0, // Default page number
    subSectionIndex: 0,
    isPageOpen: false,
   
}
const pageSlice = createSlice({
    name: "page", // Name of the slice
    initialState,
    reducers: {
      setIsUpdate(state, action) {
        state.isUpdateState = action.payload; // Update the page number
      },
      setSubSectionIndex(state, action) {
        state.subSectionIndex = action.payload
      },
      setPageOpen(state, action) {
        state.isPageOpen = action.payload; // Set open state explicitly
      },
    }
})



export const { 
    setIsUpdate,
    setSubSectionIndex,
    setPageOpen,
  } = pageSlice.actions;
  
  // Export the reducer
  export default pageSlice.reducer;