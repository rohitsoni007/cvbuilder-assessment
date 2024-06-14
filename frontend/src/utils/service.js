import { API } from "./constant";
import { http } from "./httpFormData";
import * as api from "./requests";

export const signUp = async (body) => {
  return await api
    .postReq(API.REGISTER, body)
    .then((response) => {
      return response;
    })
    .catch((err) => {});
};

export const login = async (body) => {
  return await api
    .postReq(API.LOGIN, body)
    .then((response) => {
      return response;
    })
    .catch((err) => {});
};

export const getMe = async (body) => {
  return await api
    .getReq(API.ME, body)
    .then((response) => {
      return response;
    })
    .catch((err) => {});
};

export const getResumeCount = async () => {
  return await api
    .getReq(API.RESUME_COUNT)
    .then((response) => {
      return response;
    })
    .catch((err) => {});
};

export const socialLogin = async (type, body) => {
  return await api
    .postReq(API.SOCIAL_LOGIN+ '/'+ type, body)
    .then((response) => {
      return response;
    })
    .catch((err) => {});
};


export const addResume = async (body) => {
  return await api
    .postReq(API.RESUME, body)
    .then((response) => {
      return response;
    })
    .catch((err) => {});
};

export const getAllResume = async (limit, page) => {
  return await api
    .getReq(`${API.RESUME}?limit=${limit}&page=${page}`)
    .then((response) => {
      return response;
    })
    .catch((err) => {});
};

export const editResume = async (_id, type, body) => {
  return await api
    .putReq(`${API.RESUME}/${_id}/${type}`, body)
    .then((response) => {
      return response;
    })
    .catch((err) => {});
};

export const getOneResume = async (_id) => {
  return await api
    .getReq(`${API.RESUME}/${_id}`)
    .then((response) => {
      return response;
    })
    .catch((err) => {});
};

export const deleteResume = async (_id) => {
  return await api
    .delReq(`${API.RESUME}/${_id}`)
    .then((response) => {
      return response;
    })
    .catch((err) => {});
};

export const addStripeIntent = async (body) => {
  return await api
    .postReq(API.STRIPE_INTENT, body)
    .then((response) => {
      return response;
    })
    .catch((err) => {});
};

export const confirmStripeCheckout = async (body) => {
  return await api
    .postReq(API.STRIPE_CONFIRM, body)
    .then((response) => {
      return response;
    })
    .catch((err) => {});
};

export const addResumeImage = async (body, resumeId) => {
  return await http
    .post(API.RESUME_IMAGE + `?resumeId=${resumeId || ""}`, body)
    .then((response) => {
      return response;
    })
    .catch((err) => {});
};

