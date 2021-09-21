/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { detailsUser } from '../../actions/userActions';
import { DEFAULT_IMAGE_PATH } from '../../constants/paths';

export default function Header({ user }) {
  return (
    <div className="flex border-b border-gray-primary h-4 p-4 py-8">
      {user ? (
        <div className="flex items-center">
          <Link to={`/p/${user._id}`} className="flex items-center">
            <img
              src={`/images/avatars/${user.username}.jpg`}
              alt={`${user.username} profile picture`}
              className="rounded-full h-8 w-8 flex mr-3"
              onError={(e) => {
                e.target.src = DEFAULT_IMAGE_PATH;
              }}
            />
            <p className="font-bold">{user.username}</p>
          </Link>
        </div>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
}
