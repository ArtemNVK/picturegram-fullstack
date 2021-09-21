/* eslint-disable no-nested-ternary */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import SuggestedProfile from './suggested-profile';
import { getSuggestedProfiles } from '../../actions/userActions';

export default function Suggestions({ userId, following }) {
  const dispatch = useDispatch();
  const suggestedProfiles = useSelector((state) => state.getSuggestedProfiles);
  const { loading, error, users: profiles } = suggestedProfiles;

  useEffect(() => {
    dispatch(getSuggestedProfiles(userId));
  }, [userId]);
  return !profiles ? (
    <Skeleton count={1} height={150} className="mt-5" />
  ) : profiles.length > 0 ? (
    <div className="rounded flex flex-col">
      <div className="text-sm flex items-center align-items justify-between mb-2">
        <p className="font-bold text-gray-base">Suggestions for you</p>
      </div>
      <div className="mt-4 grid gap-5">
        {profiles.map((profile) => (
          <SuggestedProfile
            key={profile._id}
            username={profile.username}
            profileId={profile._id}
            loggedInUserId={userId}
          />
        ))}
      </div>
    </div>
  ) : null;
}

Suggestions.propTypes = {
  userId: PropTypes.string,
  following: PropTypes.array
};
