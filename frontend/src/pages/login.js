import { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as ROUTES from '../constants/routes';
import { signin } from '../actions/userActions';

export default function Login() {
  const history = useHistory();
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo, loading, error } = userSignin;

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const isInvalid = password === '' || emailAddress === '';
  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();
    dispatch(signin(emailAddress, password));
  };

  useEffect(() => {
    document.title = 'Login - Picturegram';
  }, []);

  useEffect(() => {
    document.title = 'Login - Picturegram';
    if (userInfo) {
      history.push(ROUTES.DASHBOARD);
    }
    if (error) {
      setEmailAddress('');
      setPassword('');
    }
  }, [userInfo, error]);

  return (
    <div className="container flex flex-col lg:flex-row mx-auto max-w-screen-md items-center h-screen px-4 lg:px-0">
      <div className="hidden lg:flex w-5/5 lg:w-3/5">
        <img src="/images/iphone-with-profile.jpg" alt="iPhone with Instagram app" />
      </div>
      <div className="flex flex-col w-full lg:w-2/5 justify-center h-full max-w-md m-auto">
        <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
          <h1 className="flex justify-center w-full">
            <img src="/images/logo.png" alt="Instagram" className="mt-2 w-6/12 mb-4" />
          </h1>

          {error && (
            <p data-testid="error" className="mb-4 text-xs text-red-primary">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} method="POST" data-testid="login">
            <input
              aria-label="Enter your email address"
              type="text"
              placeholder="Email address"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setEmailAddress(target.value)}
              value={emailAddress}
            />
            <input
              aria-label="Enter your password"
              type="password"
              placeholder="Password"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setPassword(target.value)}
              value={password}
            />
            <button
              disabled={isInvalid}
              type="submit"
              className={`bg-blue-medium text-white w-full rounded h-8 font-bold
            ${isInvalid && 'opacity-50'}`}
            >
              Login
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary">
          <p className="text-sm">
            Don't have an account?{` `}
            <Link to={ROUTES.SIGN_UP} className="font-bold text-blue-medium" data-testid="sign-up">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
