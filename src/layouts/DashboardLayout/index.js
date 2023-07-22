import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import NavBar from './NavBar';
import TopBar from './TopBar';
import { useEffect } from 'react';
import firebase from 'firebase';
import { Navigate } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    }
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
}));

const DashboardLayout = () => {
  const classes = useStyles();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [didRedirect, setDidRedirect] = useState(false);

  const checkIfAuthenticated = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('Authenticated and ID: ' + firebase.auth().currentUser.uid);
        setDidRedirect(false);
      } else {
        setDidRedirect(true);
      }
    });
  };
  useEffect(() => {
    checkIfAuthenticated();
  }, []);

  return (
    <div className={classes.root}>
      <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
      <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
      />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            {/* {firebase.auth().currentUser.uid ? <Outlet /> : <Navigate to="/login" />} */}
            {!didRedirect && <Outlet />}
            {didRedirect && <Navigate to="/login" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
