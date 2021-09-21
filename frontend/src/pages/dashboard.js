import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/header';
import Timeline from '../components/timeline';
import Sidebar from '../components/sidebar';

export default function Dashboard() {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  useEffect(() => {
    document.title = 'Picturegram';
  }, []);

  return (
    <div className="bg-gray-background">
      <Header />
      <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg px-4 lg:px-0">
        <Timeline />
        <Sidebar />
      </div>
    </div>
  );
}
