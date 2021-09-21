import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { commentPhoto } from '../../actions/photoActions';

export default function AddComment({ userId, photoId, comments, setComments, commentInput }) {
  const [comment, setComment] = useState('');
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();

  const handleSubmitComment = (event) => {
    event.preventDefault();
    dispatch(
      commentPhoto(
        {
          comment,
          name: userInfo.username,
          userId: userInfo._id
        },
        photoId
      )
    );
    setComments([...comments, { name: userInfo.username, comment }]);
    setComment('');
  };

  return (
    <div className="border-t border-gray-primary">
      <form
        data-testid={`add-comment-submit-${userId}`}
        className="flex justify-between pl-0 pr-5"
        method="POST"
        onSubmit={(event) =>
          comment.length >= 1 ? handleSubmitComment(event) : event.preventDefault()
        }
      >
        <input
          data-testid={`add-comment-${userId}`}
          aria-label="Add a comment"
          autoComplete="off"
          className="text-sm text-gray-base w-full mr-3 py-5 px-4"
          type="text"
          name="add-comment"
          placeholder="Add a comment..."
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          ref={commentInput}
        />
        <button
          className={`text-sm font-bold text-blue-medium ${!comment && 'opacity-25'}`}
          type="button"
          disabled={comment.length < 1}
          onClick={handleSubmitComment}
        >
          Post
        </button>
      </form>
    </div>
  );
}

AddComment.propTypes = {
  userId: PropTypes.string.isRequired,
  photoId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  setComments: PropTypes.func.isRequired,
  commentInput: PropTypes.object
};
