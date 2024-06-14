
const accessTokenKey = "token";


export const setToken = (accessToken) => {
  localStorage.setItem(accessTokenKey, accessToken);
};

export const getToken = () => {
  return localStorage.getItem(accessTokenKey);
};

export const clearSession = () => {
  localStorage.removeItem(accessTokenKey);
};

export const getIsAuthenticated = () => {
  let isAuthenticated = false;
  if (localStorage.getItem("accessTokenKey")) {
    isAuthenticated = true;
  }
  return isAuthenticated;
};
