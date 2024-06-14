import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: {
    rows:[],
    count: 0
  },
  selectedResume: null,
  selectedTemplate: null,
}

export const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    getResumesData: (state, action) => {
      state.data = action.payload
    },
    selectedResumeData: (state, action) => {
      state.selectedResume = action.payload
    },
    selectedTemplateData: (state, action) => {
      state.selectedTemplate = action.payload
    },
  },
})

export const { getResumesData, selectedResumeData, selectedTemplateData } = resumeSlice.actions



export const selectResume = (state) => state.resume

export default resumeSlice.reducer
