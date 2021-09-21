import { useState } from 'react';
import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';
import AddComment from './add-comment';

export default function Comments({ userId, photoId, comments: allComments, posted, commentInput }) {
  const [comments, setComments] = useState(allComments);
  const [commentsSlice, setCommentsSlice] = useState(3);

  const showNextComments = () => {
    setCommentsSlice(commentsSlice + 3);
  };

  return (
    <>
      <div className="p-4 pt-1 pb-4">
        {comments.slice(0, commentsSlice).map((item) => (
          <p key={`${item.comment}-${item.name}`} className="mb-1">
            <Link to={`/p/${item.userId}`}>
              <span className="mr-1 font-bold">{item.name}</span>
            </Link>
            <span>{item.comment}</span>
          </p>
        ))}
        {comments.length >= 3 && commentsSlice < comments.length && (
          <button
            className="text-sm text-gray-base mb-1 cursor-pointer focus:outline-none"
            type="button"
            onClick={showNextComments}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                showNextComments();
              }
            }}
          >
            View more comments
          </button>
        )}
        <p className="text-gray-base uppercase text-xs mt-2">
          {formatDistance(Date.parse(posted), new Date())} ago
        </p>
      </div>
      <AddComment
        userId={userId}
        photoId={photoId}
        comments={comments}
        setComments={setComments}
        commentInput={commentInput}
      />
    </>
  );
}

Comments.propTypes = {
  userId: PropTypes.string.isRequired,
  photoId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  posted: PropTypes.string.isRequired,
  commentInput: PropTypes.object.isRequired
};
