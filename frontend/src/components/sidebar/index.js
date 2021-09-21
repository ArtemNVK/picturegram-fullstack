import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import User from './user';
import Suggestions from './suggestions';

export default function Sidebar() {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  return (
    <div className="hidden lg:block p-4">
      <User username={userInfo.username} fullname={userInfo.fullname} userId={userInfo._id} />
      <Suggestions userId={userInfo._id} following={userInfo.following} />
    </div>
  );
}
