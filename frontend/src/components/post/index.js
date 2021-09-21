import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import Header from './header';
import Image from './image';
import Actions from './actions';
import Footer from './footer';
import Comments from './comments';

export default function Post({ content, userId }) {
  const commentInput = useRef(null);
  const handleFocus = () => commentInput.current.focus();
  const userLikedPhoto = content.likes.includes(userId);
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const [user, setUser] = useState();

  useEffect(() => {
    const getPostUser = async () => {
      const { data } = await Axios.get(
        `https://picturegram-backend.herokuapp.com/api/users/${content.userId}`,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        }
      );
      setUser(data);
    };
    if (content.userId) {
      getPostUser();
    }
    // cleanup fn
    return () => {
      setUser({});
    };
  }, [content]);

  return (
    <div className="rounded col-span-4 border bg-white border-gray-primary mb-12">
      <Header user={user} />
      <Image src={content.image} caption={content.caption} />
      <Actions
        userId={content.userId}
        photoId={content._id}
        totalLikes={content?.likes?.length}
        likedPhoto={userLikedPhoto}
        handleFocus={handleFocus}
      />
      {user && <Footer caption={content.caption} username={user?.username} />}
      <Comments
        userId={content.userId}
        photoId={content._id}
        comments={content.comments}
        posted={content.createdAt}
        commentInput={commentInput}
      />
    </div>
  );
}

Post.propTypes = {
  userId: PropTypes.string.isRequired,
  content: PropTypes.shape({
    image: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    likes: PropTypes.array.isRequired,
    comments: PropTypes.array.isRequired,
    createdAt: PropTypes.string.isRequired
  })
};
