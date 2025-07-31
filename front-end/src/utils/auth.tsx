import { tokenKey } from "../constants/common";

export function setToken(userToken: string) {
  try {
    localStorage.setItem(tokenKey, userToken);
  } catch (error) {
    return null;
  }
}

export function getToken() {
  try {
    const tokenString = localStorage.getItem(tokenKey);
    return tokenString;
  } catch (error) {
    return "";
  }
}
