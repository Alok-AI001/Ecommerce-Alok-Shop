
import {
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
} from "../constants/userConstants";

import axios from "axios";

const API_URL = "https://alok-shop-backend.onrender.com";

const getAuthConfig = (userInfo) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userInfo.token}`,
  },
});

// USER SIGNUP
export const signup = (fname, lname, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_SIGNUP_REQUEST });

    const { data } = await axios.post(
      `${API_URL}/api/users/register/`,
      {
        fname: fname.trim(),
        lname: lname.trim(),
        email: email.trim().toLowerCase(),
        password,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    dispatch({
      type: USER_SIGNUP_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_SIGNUP_FAIL,
      payload:
        error.response?.data?.details ||
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message,
    });
  }
};

// USER LOGIN
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const { data } = await axios.post(
      `${API_URL}/api/users/login/`,
      {
        username: email.trim().toLowerCase(),
        password: password,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message,
    });
  }
};

// USER LOGOUT
export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
};

// LIST USERS
export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const { data } = await axios.get(
      `${API_URL}/api/users/getallusers/`,
      getAuthConfig(userInfo)
    );

    dispatch({
      type: USER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

// DELETE USER
export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const { data } = await axios.delete(
      `${API_URL}/api/users/delete/${id}/`,
      getAuthConfig(userInfo)
    );

    dispatch({
      type: USER_DELETE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

// UPDATE USER
export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const { data } = await axios.put(
      `${API_URL}/api/users/update/${user._id}/`,
      user,
      getAuthConfig(userInfo)
    );

    dispatch({ type: USER_UPDATE_SUCCESS });

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

// GET USER DETAILS
export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const { data } = await axios.get(
      `${API_URL}/api/users/${id}/`,
      getAuthConfig(userInfo)
    );

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

// UPDATE USER PROFILE
export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const { data } = await axios.put(
      `${API_URL}/api/users/profile/update/`,
      user,
      getAuthConfig(userInfo)
    );

    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};
