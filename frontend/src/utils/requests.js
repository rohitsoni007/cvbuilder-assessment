import * as req from "./http";

export const postReq = async (path, body) => {
  return await req.http
    .post(path, body)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return err
    });
};

export const getReq = async (path) => {
  return await req.http
    .get(path)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return err
    });
};

export const putReq = async (path, body) => {
  return await req.http
    .put(path, body)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return err
    });
};

export const delReq = async (path, body) => {
  return await req.http
    .delete(path, body)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return err
    });
};
