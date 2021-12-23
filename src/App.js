import { STATE_FORGETPASS, STATE_LOGIN } from 'components/AuthForm';
import GAListener from 'components/GAListener';
import { EmptyLayout, LayoutRoute, MainLayout } from 'components/Layout';
import PrivateRoute from 'components/Layout/PrivateRoute';
import PageSpinner from 'components/PageSpinner';
// import CheckGudang from 'pages/CheckGudang';
import AuthPage from 'pages/template/AuthPage';
import ResetPasswordForm from 'components/ResetPasswordForm';
import React from 'react';
import componentQueries from 'react-component-queries';
import { BrowserRouter, Redirect, Switch } from 'react-router-dom';
import './styles/reduction.scss';
import * as firebase from 'firebase/app';
import 'firebase/performance';
import 'firebase/auth';
import warningPage from 'pages/template/warningPage';
// import LandingPage from './pages/template/LandingPage';

const firebaseConfig = {
  apiKey: 'AIzaSyBF7ptrdf9eU-2imtyk7nK_004VwgBsZcw',
  authDomain: 'neo-genesis-development.firebaseapp.com',
  databaseURL: 'https://neo-genesis-development.firebaseio.com',
  projectId: 'neo-genesis-development',
  storageBucket: '',
  messagingSenderId: '24627510397',
  appId: '1:24627510397:web:5f1059eb90bbb2c5',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const Dashboard = React.lazy(() => import('pages/template/DashboardPage'));
const TestPage = React.lazy(() => import('pages/TestPage'));


const getBasename = () => {
  return `/${process.env.PUBLIC_URL.split('/').pop()}`;
};

class App extends React.Component {
  state = {
    title: '',
    color: '',
    menuID: '',
  };

  setTitle = (title, color) => {
    this.setState({ title: title, color: color });
  };

  getAccess() {
    var accessList = JSON.parse(window.localStorage.getItem('accessList'));
    console.log('ACCESSLIST', accessList);
    if (accessList !== null && accessList !== undefined) {
      // console.log('MENU ID MASUK 1');
      if (Object.keys(accessList).includes('12')) {
        // console.log('MENU ID 12');
        this.setState({ menuID: '12' });
      } else if (Object.keys(accessList).includes('15')) {
        // console.log('MENU ID 15');
        this.setState({ menuID: '15' });
      } else if (Object.keys(accessList).includes('7')) {
        // console.log('MENU ID 7');
        this.setState({ menuID: '7' });
      } else if (Object.keys(accessList).includes('16')) {
        // console.log('MENU ID 16');
        this.setState({ menuID: '16' });
      } else if (Object.keys(accessList).includes('24')) {
        // console.log('MENU ID 24');
        this.setState({ menuID: '24' });
      } else {
        // console.log('MENU ID MASUK 2');
        return;
      }
    }
    // console.log('MENU ID MASUK 3');
    return;
  }

  componentDidMount() {
    this.getAccess();
  }

  render() {
    return (
      <BrowserRouter basename={getBasename()}>
        <GAListener>
          <Switch>
            <LayoutRoute
              exact
              path="/login"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_LOGIN} />
              )}
            />
            <LayoutRoute
              exact
              path="/lupapassword"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_FORGETPASS} />
              )}
            />
            <PrivateRoute
              exact
              menuID={this.state.menuID}
              path="/resetpassword"
              layout={EmptyLayout}
              component={props => (
                //<ResetPWd>
                <ResetPasswordForm {...props} />
              )}
            />

            <MainLayout
              breakpoint={this.props.breakpoint}
              title={this.state.title}
              color={this.state.color}
            >
              <React.Suspense fallback={<PageSpinner />}>
                {/* {console.log('MENU ID', this.state.menuID)} */}
                <PrivateRoute
                  exact
                  menuID={this.state.menuID}
                  path="/"
                  component={TestPage}
                />
                
              </React.Suspense>
            </MainLayout>
            <Redirect to="/" />
          </Switch>
        </GAListener>
      </BrowserRouter>
    );
  }
}

const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: 'xs' };
  }

  if (576 < width && width < 767) {
    return { breakpoint: 'sm' };
  }

  if (768 < width && width < 991) {
    return { breakpoint: 'md' };
  }

  if (992 < width && width < 1199) {
    return { breakpoint: 'lg' };
  }

  if (width > 1200) {
    return { breakpoint: 'xl' };
  }

  return { breakpoint: 'xs' };
};

export default componentQueries(query)(App);
