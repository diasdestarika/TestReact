import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import WarningPage from 'pages/template/warningPage';

function getPermission(page, Component, rest) {
  // console.log(Component);
  //   console.log(page.location.pathname);
  var result = false;
  var accessList = {};
  // if (window.localStorage.getItem('profile')) {
  //   var profileList = JSON.parse(window.localStorage.getItem('profile'));
  //   accessList = profileList.mem_access;

  //   result = true;
  // } else {
  //   result = false;
  // }

  if (window.localStorage.getItem('accessList')) {
    accessList = JSON.parse(window.localStorage.getItem('accessList'));
    // console.log('aksesList', accessList);
    result = true;
  } else {
    result = false;
  }

  // console.log("ARCHIEVE", accessList, "A");
  //   console.log(window.localStorage.getItem('accessList'), "B");

  //isAccess =true   Allow access page
  var isAccess = false;

  console.log("RESULT STATUS", result);
  if (result === true) {
    if (
      page.location.pathname === '/resetpassword' &&
      page.location.state !== undefined
    ) {
      //block Access to /resetpassword by URL
      isAccess = false;
    }
  } else {
    if (
      page.location.pathname === '/resetpassword' &&
      page.location.state !== undefined
    ) {
      //block Access to /resetpassword by URL
      isAccess = true;
    }
  }
  // console.log("ISI RESULT", result);

  if (result === true) {
    if (
      page.location.pathname === '/login' ||
      page.location.pathname === '/lupapassword' 
      // ||
      // page.location.pathname === '/resetpassword'
    ) {
      console.log("PATHNAME", page.location.pathname)
      return (
        <Redirect
          to={{
            pathname: '/login',
          }}
        />
      );
    } else {
      //check acces in accessList
      var isAccess = Object.keys(accessList).includes(rest.menuID);
      // console.log('rest', rest, 'MENU ID', rest.menuID);
    }
  } else {
    if (
      page.location.pathname !== '/login' &&
      page.location.pathname !== '/lupapassword' &&
      page.location.pathname !== '/resetpassword'
    ) {
      // alert("SILAKAN LOGIN TERLEBIH DAHULU")
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
    // console.log({ ...page });
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
