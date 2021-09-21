/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_IMAGE_PATH } from '../../constants/paths';
import { detailsUser, followUser, signin } from '../../actions/userActions';

export default function Header({ photosCount, user }) {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const [isFollowingProfile, setIsFollowingProfile] = useState(
    userInfo.following.includes(user._id)
  );
  const [followerCount, setFollowerCount] = useState(user.followers.length);
  const activeBtnFollow = userInfo?.username && userInfo?.username !== user.username;
  const dispatch = useDispatch();
  const userFollow = useSelector((state) => state.userFollow);
  const { success } = userFollow;

  const handleToggleFollow = async () => {
    dispatch(followUser(userInfo._id, user._id));
    setIsFollowingProfile((isFollowingProfile) => !isFollowingProfile);
    setFollowerCount((prev) => (isFollowingProfile ? prev - 1 : prev + 1));
  };

  return (
    <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
      <div className="container flex justify-center items-center">
        {user ? (
          <img
            className="rounded-full h-16 w-16 md:h-20 lg:h-40 md:w-20 lg:w-40 flex"
            alt={`${user.username} profile picture`}
            src={`/images/avatars/${user.username}.jpg`}
            onError={(e) => {
              e.target.src = DEFAULT_IMAGE_PATH;
            }}
          />
        ) : (
          <Skeleton circle height={150} width={150} count={1} />
        )}
      </div>
      <div className="flex items-center justify-center flex-col col-span-2">
        <div className="container flex items-center">
          <p className="text-2xl mr-4">{user.username}</p>
          {activeBtnFollow && isFollowingProfile === null ? (
            <Skeleton count={1} width={80} height={32} />
          ) : (
            activeBtnFollow && (
              <button
                className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8"
                type="button"
                onClick={handleToggleFollow}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleToggleFollow();
                  }
                }}
              >
                {isFollowingProfile ? 'Unfollow' : 'Follow'}
              </button>
            )
          )}
        </div>
        <div className="container flex mt-4 flex-col lg:flex-row">
          {!user.followers || !user.following ? (
            <Skeleton count={1} width={677} height={24} />
          ) : (
            <>
              <p className="mr-10">
                <span className="font-bold">{photosCount}</span> photos
              </p>
              <p className="mr-10">
                <span className="font-bold">{followerCount}</span>
                {` `}
                {followerCount === 1 ? `follower` : `followers`}
              </p>
              <p className="mr-10">
                <span className="font-bold">{user.following?.length}</span> following
              </p>
            </>
          )}
        </div>
        <div className="container mt-4">
          <p className="font-medium">
            {!user.fullname ? <Skeleton count={1} height={24} /> : user.fullname}
          </p>
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  photosCount: PropTypes.number.isRequired,
  user: PropTypes.shape({
    _id: PropTypes.string,
    fullname: PropTypes.string,
    username: PropTypes.string,
    followers: PropTypes.array,
    following: PropTypes.array
  }).isRequired
};
