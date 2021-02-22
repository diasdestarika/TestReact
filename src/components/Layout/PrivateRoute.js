/* eslint-disable no-redeclare */
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import WarningPage from 'pages/template/warningPage';

function getPermission(page, Component, rest) {
  //console.log(Component);
  //console.log(page.location.pathname);
  var result = false;
  var accessList = {};
  if (window.localStorage.getItem('accessList')) {
    accessList = JSON.parse(window.localStorage.getItem('accessList'));
    result = true;
  } else {
    result = false;
  }
  // console.log("Hak Access: ",accessList);
  // console.log(window.localStorage.getItem('accessList'), "B");

  //isAccess =true   Allow access page
  var isAccess = false;

  if (
    page.location.pathname === '/resetpassword' &&
    page.location.state !== undefined
  ) {
    //block Access to /resetpassword by URL
    isAccess = false;
  }

  if (result === true) {
    if (
      page.location.pathname === '/login' ||
      page.location.pathname === '/lupapassword' ||
      page.location.pathname === '/resetpassword'
    ) {
      return (
        <Redirect
          to={{
            pathname: '/',
          }}
        />
      );
    } else {
      //check acces in accessList
      var isAccess = Object.keys(accessList).includes(rest.menuID);
    }
  } else {
    if (
      page.location.pathname !== '/login' &&
      page.location.pathname !== '/lupapassword' &&
      page.location.pathname !== '/resetpassword'
    ) {
      return (
        <Redirect
          to={{
            pathname: '/login',
            // state: { from: page }
          }}
        />
      );
    }
  }

  if (isAccess === true) {
    return <Component {...page} {...rest} />;
  } else {
    //console.log({ ...page });
    return <WarningPage {...page} />;
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={page => getPermission(page, Component, { ...rest })}
  />
);

export default PrivateRoute;
