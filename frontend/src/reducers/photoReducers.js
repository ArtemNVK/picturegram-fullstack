const {
  PHOTO_LIST_REQUEST,
  PHOTO_LIST_SUCCESS,
  PHOTO_LIST_FAIL,
  PHOTO_DETAILS_REQUEST,
  PHOTO_DETAILS_SUCCESS,
  PHOTO_DETAILS_FAIL,
  PHOTO_CREATE_REQUEST,
  PHOTO_CREATE_SUCCESS,
  PHOTO_CREATE_FAIL,
  PHOTO_CREATE_RESET,
  PHOTO_BY_USERID_REQUEST,
  PHOTO_BY_USERID_SUCCESS,
  PHOTO_BY_USERID_FAIL,
  PHOTO_FEED_REQUEST,
  PHOTO_FEED_SUCCESS,
  PHOTO_FEED_FAIL,
  PHOTO_LIKE_REQUEST,
  PHOTO_LIKE_SUCCESS,
  PHOTO_LIKE_FAIL,
  PHOTO_COMMENT_FAIL,
  PHOTO_COMMENT_SUCCESS,
  PHOTO_COMMENT_REQUEST
} = require('../constants/photoConstants');

export const photoListReducer = (state = { loading: true, photos: [] }, action) => {
  switch (action.type) {
    case PHOTO_LIST_REQUEST:
      return { loading: true };
    case PHOTO_LIST_SUCCESS:
      return { loading: false, photos: action.payload };
    case PHOTO_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const photosByUserIdReducer = (state = { loading: true, photos: [] }, action) => {
  switch (action.type) {
    case PHOTO_BY_USERID_REQUEST:
      return { loading: true };
    case PHOTO_BY_USERID_SUCCESS:
      return { loading: false, photos: action.payload };
    case PHOTO_BY_USERID_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const photoDetailsReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case PHOTO_DETAILS_REQUEST:
      return { loading: true };
    case PHOTO_DETAILS_SUCCESS:
      return { loading: false, photos: action.payload };
    case PHOTO_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const photoGetFeedReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case PHOTO_FEED_REQUEST:
      return { loading: true };
    case PHOTO_FEED_SUCCESS:
      return { loading: false, photos: action.payload };
    case PHOTO_FEED_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const photoLikeReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case PHOTO_LIKE_REQUEST:
      return { loading: true };
    case PHOTO_LIKE_SUCCESS:
      return { loading: false, data: action.payload };
    case PHOTO_LIKE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const photoCommentReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case PHOTO_COMMENT_REQUEST:
      return { loading: true };
    case PHOTO_COMMENT_SUCCESS:
      return { loading: false, data: action.payload };
    case PHOTO_COMMENT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const photoCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PHOTO_CREATE_REQUEST:
      return { loading: true };
    case PHOTO_CREATE_SUCCESS:
      return { loading: false, success: true, photo: action.payload };
    case PHOTO_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case PHOTO_CREATE_RESET:
      return {};
    default:
      return state;
  }
};
