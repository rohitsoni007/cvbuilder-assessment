import { getMe } from "utils/service";
import { setUserData } from "./authSlice";


export const setUserDataAction = (payload) => async (dispatch) => {
    let resp = await getMe();
    if(resp){
        dispatch(setUserData(resp?.data?.data?.user))
    }
};

export const loginAction = (payload) => async (dispatch) => {
    let resp = await getMe();
    if(resp){
        dispatch(setUserData(resp?.data?.data?.user))
    }
};
