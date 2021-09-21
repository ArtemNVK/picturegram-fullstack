import { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Header from './header';
import Photos from './photos';
import { getPhotosByUserId } from '../../actions/photoActions';

export default function Profile({ user }) {
  const photosByUserId = useSelector((state) => state.photosByUserId);
  const { loading, error, photos } = photosByUserId;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPhotosByUserId(user._id));
  }, [user._id]);

  return (
    <>
      <Header photosCount={photos ? photos.length : 0} user={user} />
      <Photos photos={photos} />
    </>
  );
}

Profile.propTypes = {
  user: PropTypes.shape({
    dateCreated: PropTypes.number,
    emailAddress: PropTypes.string,
    followers: PropTypes.array,
    following: PropTypes.array,
    fullname: PropTypes.string,
    _id: PropTypes.string,
    username: PropTypes.string
  })
};
