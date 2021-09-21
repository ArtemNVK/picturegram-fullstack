import { useParams, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as ROUTES from '../constants/routes';
import Header from '../components/header';
import UserProfile from '../components/profile';
import { detailsUser } from '../actions/userActions';

export default function Profile() {
  const { id } = useParams();
  const history = useHistory();
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(detailsUser(id));
  }, [id]);

  useEffect(() => {
    if (error) {
      history.push(ROUTES.NOT_FOUND);
    }
  }, [error]);

  return user?.username ? (
    <div className="bg-gray-background">
      <Header />
      <div className="mx-auto max-w-screen-lg">
        <UserProfile user={user} />
      </div>
    </div>
  ) : null;
}
