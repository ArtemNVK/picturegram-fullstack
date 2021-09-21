import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Login from '../../pages/login';
import FirebaseContext from '../../context/firebase';
import * as ROUTES from '../../constants/routes';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush
  })
}));

describe('<Login />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the login page with a form submission and logs the user in', async () => {
    const succeededToLogin = jest.fn(() => Promise.resolve('I am signed in!'));
    const firebase = {
      auth: jest.fn(() => ({
        signInWithEmailAndPassword: succeededToLogin
      }))
    };
    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <Login />
        </FirebaseContext.Provider>
      </Router>
    );
    await act(async () => {
      expect(document.title).toEqual('Login - Instagram');

      await fireEvent.change(getByPlaceholderText('Email address'), {
        target: { value: 'borat@gmail.com' }
      });
      await fireEvent.change(getByPlaceholderText('Password'), {
        target: { value: '123456' }
      });
      fireEvent.submit(getByTestId('login'));
      fireEvent.submit(getByTestId('sign-up'));

      expect(succeededToLogin).toHaveBeenCalled();
      expect(succeededToLogin).toHaveBeenCalledWith('borat@gmail.com', '123456');

      await waitFor(() => {
        expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.DASHBOARD);
        expect(getByPlaceholderText('Email address').value).toBe('borat@gmail.com');
        expect(getByPlaceholderText('Password').value).toBe('123456');
        expect(queryByTestId('error')).toBeFalsy();
      });
    });
  });

  it('renders the login page with a form submission and fails to login the user', async () => {
    const failToLogin = jest.fn(() => Promise.reject(new Error('Cannot sign in!')));
    const firebase = {
      auth: jest.fn(() => ({
        signInWithEmailAndPassword: failToLogin
      }))
    };
    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <Login />
        </FirebaseContext.Provider>
      </Router>
    );
    await act(async () => {
      expect(document.title).toEqual('Login - Instagram');

      await fireEvent.change(getByPlaceholderText('Email address'), {
        target: { value: 'borat.com' }
      });
      await fireEvent.change(getByPlaceholderText('Password'), {
        target: { value: '123456' }
      });
      fireEvent.submit(getByTestId('login'));
      fireEvent.submit(getByTestId('sign-up'));

      expect(failToLogin).toHaveBeenCalled();
      expect(failToLogin).toHaveBeenCalledWith('borat@gmail.com', '123456');

      await waitFor(() => {
        expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.DASHBOARD);
        expect(getByPlaceholderText('Email address').value).toBe('');
        expect(getByPlaceholderText('Password').value).toBe('');
        expect(queryByTestId('error')).toBeTruthy();
      });
    });
  });
});