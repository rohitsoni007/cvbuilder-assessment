import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.data = action.payload
    },
  },
})

export const { setUserData } = authSlice.actions



export const selectResume = (state) => state.resume

export default authSlice.reducer
