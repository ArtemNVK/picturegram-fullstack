import { lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ReactLoader from './components/loader';
import * as ROUTES from './constants/routes';

import ProtectedRoute from './helpers/protected-route';

const Login = lazy(() => import('./pages/login'));
const SignUp = lazy(() => import('./pages/sign-up'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Profile = lazy(() => import('./pages/profile'));
const NotFound = lazy(() => import('./pages/not-found'));

export default function App() {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  return (
    <Router>
      <Suspense fallback={<ReactLoader />}>
        <Switch>
          <Route path={ROUTES.LOGIN} component={Login} />
          <Route path={ROUTES.SIGN_UP} component={SignUp} />
          <Route path={ROUTES.PROFILE} component={Profile} />
          <ProtectedRoute user={userInfo} path={ROUTES.DASHBOARD} exact>
            <Dashboard />
          </ProtectedRoute>
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Router>
  );
}
