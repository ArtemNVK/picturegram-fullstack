/* eslint-disable no-else-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-nested-ternary */
import { useState, useContext, useEffect, useRef, useCallback } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { createPhoto, getFeed } from '../actions/photoActions';
import { detailsUser } from '../actions/userActions';
import Post from './post';
import ReactLoader from './loader';

export default function Timeline() {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const feed = useSelector((state) => state.photoGetFeed);
  const { loading, error, photos } = feed;
  const dispatch = useDispatch();
  const [image, setImage] = useState('');
  const [caption, setCaption] = useState('');
  const isInvalid = caption === '' || image === '';
  const [displayCreatePanel, setDisplayCreatePanel] = useState(false);
  const [displayPostButton, setDisplayPostButton] = useState(true);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [successUpload, setSuccessUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState('');
  const photoCreate = useSelector((state) => state.photoCreate);
  const { loading: loadingCreate, error: errorCreate, success: successCreate, photo } = photoCreate;
  const [page, setPage] = useState(1);
  const [feedPhotos, setFeedPhotos] = useState([]);

  const onClickHandler = () => {
    setDisplayCreatePanel((displayCreatePanel) => !displayCreatePanel);
    setDisplayPostButton((displayPostButton) => !displayPostButton);
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    setLoadingUpload(true);

    try {
      const { data } = await Axios.post(
        'https://picturegram-backend.herokuapp.com/api/uploads',
        bodyFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );
      console.log(data);
      setImage(data.location);
      setLoadingUpload(false);
      setSuccessUpload(true);
    } catch (error) {
      setErrorUpload(error.message);
      setLoadingUpload(false);
    }
  };

  const createHandler = (e) => {
    e.preventDefault();
    dispatch(
      createPhoto({
        image,
        caption,
        _id: userInfo._id
      })
    );
    setSuccessUpload(false);
    setDisplayCreatePanel((displayCreatePanel) => !displayCreatePanel);
    setDisplayPostButton((displayPostButton) => !displayPostButton);
    setImage('');
    setCaption('');
    if (userInfo?.following) {
      dispatch(getFeed(userInfo?.following, userInfo._id, page));
    }
  };

  const onCloseHandler = () => {
    setDisplayCreatePanel((displayCreatePanel) => !displayCreatePanel);
    setDisplayPostButton((displayPostButton) => !displayPostButton);
    setImage('');
    setCaption('');
  };

  const observer = useRef();
  const lastAsteroidElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !photos?.noMoreResults) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, photos?.noMoreResults]
  );

  useEffect(() => {
    if (userInfo?.following) {
      dispatch(getFeed(userInfo?.following, userInfo._id, page));
    }
  }, [userInfo, page]);

  useEffect(() => {
    const pics = photos?.photos;
    console.log(pics);
    if (pics) {
      setFeedPhotos((prev) => [...prev, ...pics]);
    }
  }, [photos]);

  useEffect(() => {
    if (successCreate) {
      window.location.reload();
    }
  }, [successCreate]);

  return (
    <div className="col-span-3 lg:col-span-2 mb-20">
      <div className="mb-5">
        {displayPostButton && (
          <button
            type="submit"
            className="bg-blue-medium text-white w-full rounded h-8 font-bold"
            onClick={() => onClickHandler()}
          >
            Post A New Picture
          </button>
        )}
        {displayCreatePanel && (
          <form onSubmit={createHandler}>
            <div className="flex mb-5 justify-between">
              <input type="file" id="imageFile" label="Choose Image" onChange={uploadFileHandler} />
              {successUpload && <span className="font-bold ml-5">Uploaded succesfully!</span>}
              {loadingUpload && <span>File is being uploaded...</span>}
              <span
                className="cursor-pointer font-bold text-blue-medium"
                onClick={() => onCloseHandler()}
              >
                Close
              </span>
            </div>
            <textarea
              aria-label="Enter your caption"
              type="text"
              placeholder="Caption"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-20 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setCaption(target.value)}
              value={caption}
            />
            {errorCreate && <p>{errorCreate.message}</p>}
            <button
              disabled={isInvalid}
              type="submit"
              className={`bg-blue-medium text-white w-full rounded h-8 font-bold
            ${isInvalid && 'opacity-50'}`}
            >
              Create New Picture
            </button>
          </form>
        )}
      </div>

      {!feedPhotos && <Skeleton count={4} width={640} height={500} className="mb-5" />}
      {feedPhotos.length > 0 &&
        feedPhotos.map((content, index) => {
          if (feedPhotos?.length === index + 1) {
            return (
              <div ref={lastAsteroidElementRef} key={content._userId + index}>
                <Post
                  key={content?._id + Date.now() + content.caption}
                  content={content}
                  userId={userInfo._id}
                />
              </div>
            );
          } else {
            return (
              <Post
                key={content?._id + Date.now() + content.caption}
                content={content}
                userId={userInfo._id}
              />
            );
          }
        })}
      {loading && <ReactLoader />}
    </div>
  );
}
