import { addResume, deleteResume, editResume, getAllResume, getOneResume } from "utils/service";
import { getResumesData, selectedResumeData, selectedTemplateData } from "./resumeSlice";

export const addResumeAction = (payload) => async (dispatch) => {
  let resp = await addResume(payload);
  if(resp){
    dispatch(selectedResumeData(resp?.data?.data))
  }
};


export const editResumeAction = (payload) => async (dispatch) => {
    let resp = await editResume(payload._id, payload.type, payload.data);

    if(resp){
        dispatch(selectedResumeData(resp?.data?.data?.updatedResume))
        dispatch(selectedTemplateData(resp?.data?.data?.updatedResume?.template))
    }
};

export const getAllResumeAction = (payload) => async (dispatch) => {
    let resp = await getAllResume(payload.limit, payload.page);
    if(resp){
      dispatch(getResumesData(resp?.data?.data))
    }
};

export const getOneResumeAction = (payload) => async (dispatch) => {
  let resp = await getOneResume(payload);

  if(resp){
    dispatch(selectedResumeData(resp?.data?.data?.resume))
    dispatch(selectedTemplateData(resp?.data?.data?.resume?.template))

  }
};

export const deleteResumeAction = (payload) => async (dispatch) => {
  let resp = await deleteResume(payload);
  if(resp?.data){
    let respAll = await getAllResume(5, 1);
    if(respAll){
      dispatch(getResumesData(respAll?.data?.data))
    }
  }
};

