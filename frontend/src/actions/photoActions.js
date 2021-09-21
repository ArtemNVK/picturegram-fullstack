import Axios from 'axios';
import {
  PHOTO_BY_USERID_FAIL,
  PHOTO_BY_USERID_REQUEST,
  PHOTO_BY_USERID_SUCCESS,
  PHOTO_COMMENT_FAIL,
  PHOTO_COMMENT_REQUEST,
  PHOTO_COMMENT_SUCCESS,
  PHOTO_CREATE_FAIL,
  PHOTO_CREATE_REQUEST,
  PHOTO_CREATE_SUCCESS,
  PHOTO_DETAILS_FAIL,
  PHOTO_DETAILS_REQUEST,
  PHOTO_DETAILS_SUCCESS,
  PHOTO_FEED_FAIL,
  PHOTO_FEED_REQUEST,
  PHOTO_FEED_SUCCESS,
  PHOTO_LIKE_FAIL,
  PHOTO_LIKE_REQUEST,
  PHOTO_LIKE_SUCCESS,
  PHOTO_LIST_FAIL,
  PHOTO_LIST_REQUEST,
  PHOTO_LIST_SUCCESS
} from '../constants/photoConstants';

export const listPhotos = () => async (dispatch) => {
  dispatch({
    type: PHOTO_LIST_REQUEST
  });
  try {
    const { data } = await Axios.get(`https://picturegram-backend.herokuapp.com/api/photos`);
    dispatch({ type: PHOTO_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PHOTO_LIST_FAIL, payload: error.message });
  }
};

export const getPhotosByUserId = (userId) => async (dispatch) => {
  dispatch({ type: PHOTO_BY_USERID_REQUEST, payload: userId });
  try {
    const { data } = await Axios.get(
      `https://picturegram-backend.herokuapp.com/api/photos/user-pictures/${userId}`
    );
    dispatch({ type: PHOTO_BY_USERID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PHOTO_BY_USERID_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message
    });
  }
};

export const getFeed = (following, userId, page) => async (dispatch, getState) => {
  dispatch({ type: PHOTO_FEED_REQUEST, payload: following });
  const {
    userSignin: { userInfo }
  } = getState();
  try {
    const { data } = await Axios.post(
      `https://picturegram-backend.herokuapp.com/api/photos/feed/${page}`,
      {
        following,
        _id: userId
      },
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      }
    );
    dispatch({ type: PHOTO_FEED_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PHOTO_FEED_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message
    });
  }
};

export const detailsPhoto = (photoId) => async (dispatch) => {
  dispatch({ type: PHOTO_DETAILS_REQUEST, payload: photoId });
  try {
    const { data } = await Axios.get(
      `https://picturegram-backend.herokuapp.com/api/photos/${photoId}`
    );
    dispatch({ type: PHOTO_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PHOTO_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message
    });
  }
};

export const likePhoto = (userId, id) => async (dispatch, getState) => {
  dispatch({ type: PHOTO_LIKE_REQUEST, payload: userId });
  const {
    userSignin: { userInfo }
  } = getState();
  try {
    const { data } = await Axios.put(
      `https://picturegram-backend.herokuapp.com/api/photos/${id}/like`,
      {
        userId
      },
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      }
    );
    dispatch({ type: PHOTO_LIKE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PHOTO_LIKE_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message
    });
  }
};

export const commentPhoto = (comment, id) => async (dispatch, getState) => {
  dispatch({ type: PHOTO_COMMENT_REQUEST, payload: comment });
  const {
    userSignin: { userInfo }
  } = getState();
  try {
    const { data } = await Axios.put(
      `https://picturegram-backend.herokuapp.com/api/photos/${id}/add-comment`,
      {
        comment
      },
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      }
    );
    dispatch({ type: PHOTO_COMMENT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PHOTO_COMMENT_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message
    });
  }
};

export const createPhoto = (photo) => async (dispatch, getState) => {
  dispatch({ type: PHOTO_CREATE_REQUEST });
  const {
    userSignin: { userInfo }
  } = getState();
  try {
    const { data } = await Axios.post(
      'https://picturegram-backend.herokuapp.com/api/photos',
      photo,
      {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      }
    );
    dispatch({
      type: PHOTO_CREATE_SUCCESS,
      payload: data
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PHOTO_CREATE_FAIL, payload: message });
  }
};
