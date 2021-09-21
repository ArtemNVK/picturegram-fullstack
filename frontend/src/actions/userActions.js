import Axios from 'axios';
import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNOUT,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_FOLLOW_REQUEST,
  USER_FOLLOW_SUCCESS,
  USER_FOLLOW_FAIL,
  USER_SUGGESTED_LIST_REQUEST,
  USER_SUGGESTED_LIST_SUCCESS,
  USER_SUGGESTED_LIST_FAIL
} from '../constants/userConstants';

export const register = (username, fullname, email, password) => async (dispatch) => {
  dispatch({ type: USER_REGISTER_REQUEST, payload: { username, fullname, email, password } });
  try {
    const { data } = await Axios.post(
      'https://picturegram-backend.herokuapp.com/api/users/register',
      {
        username,
        fullname,
        email,
        password
      }
    );
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message
    });
  }
};

export const signin = (email, password) => async (dispatch) => {
  dispatch({ type: USER_SIGNIN_REQUEST, payload: { email, password } });
  try {
    const { data } = await Axios.post(
      'https://picturegram-backend.herokuapp.com/api/users/signin',
      {
        email,
        password
      }
    );
    dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_SIGNIN_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message
    });
  }
};

export const signout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: USER_SIGNOUT });
  // document.location.href = '/signin';
};

export const detailsUser = (userId) => async (dispatch, getState) => {
  dispatch({ type: USER_DETAILS_REQUEST, payload: userId });
  const {
    userSignin: { userInfo }
  } = getState();
  try {
    const { data } = await Axios.get(
      `https://picturegram-backend.herokuapp.com/api/users/${userId}`,
      {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      }
    );
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: USER_DETAILS_FAIL, payload: message });
  }
};

export const followUser = (userId, userToFollowId) => async (dispatch, getState) => {
  dispatch({ type: USER_FOLLOW_REQUEST });
  const {
    userSignin: { userInfo }
  } = getState();
  try {
    const { data } = await Axios.put(
      `https://picturegram-backend.herokuapp.com/api/users/profile`,
      {
        userId,
        userToFollowId
      },
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      }
    );
    localStorage.setItem('userInfo', JSON.stringify(data.user));
    dispatch({ type: USER_FOLLOW_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_FOLLOW_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message
    });
  }
};

export const listUsers = async (dispatch, getState) => {
  dispatch({ type: USER_LIST_REQUEST });
  try {
    const {
      userSignin: { userInfo }
    } = getState();
    const { data } = await Axios.get(`https://picturegram-backend.herokuapp.com/api/users`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    });
    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: USER_LIST_FAIL, payload: message });
  }
};

export const getSuggestedProfiles = (userId) => async (dispatch, getState) => {
  dispatch({ type: USER_SUGGESTED_LIST_REQUEST });
  try {
    const {
      userSignin: { userInfo }
    } = getState();
    const { data } = await Axios.get(
      `https://picturegram-backend.herokuapp.com/api/users/suggested-profiles/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      }
    );
    dispatch({ type: USER_SUGGESTED_LIST_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: USER_SUGGESTED_LIST_FAIL, payload: message });
  }
};
