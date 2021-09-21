import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { followUser } from '../../actions/userActions';

export default function SuggestedProfile({ username, profileId, loggedInUserId }) {
  const [followed, setFollowed] = useState(false);
  const dispatch = useDispatch();

  async function handleFollowUser() {
    dispatch(followUser(loggedInUserId, profileId));
    setFollowed((followed) => !followed);
  }

  return !followed ? (
    <div className="flex flex-row items-center align-items justify-between">
      <div className="flex items-center justify-between">
        <img
          className="rounded-full w-8 flex mr-3"
          src={`/images/avatars/${username}.jpg`}
          alt=""
          onError={(e) => {
            e.target.src = `/images/avatars/default.png`;
          }}
        />
        <Link to={`/p/${profileId}`}>
          <p className="font-bold text-sm">{username}</p>
        </Link>
      </div>
      <button
        className="text-xs font-bold text-blue-medium"
        type="button"
        onClick={handleFollowUser}
      >
        Follow
      </button>
    </div>
  ) : null;
}

SuggestedProfile.propTypes = {
  username: PropTypes.string.isRequired,
  profileId: PropTypes.string.isRequired,
  loggedInUserId: PropTypes.string.isRequired
};
