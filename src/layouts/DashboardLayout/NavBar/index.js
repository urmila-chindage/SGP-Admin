import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Award as AchivementIcon
} from 'react-feather';
import UpdateIcon from '@material-ui/icons/Update';
import AssignmentIndOutlinedIcon from '@material-ui/icons/AssignmentIndOutlined';
import NavItem from './NavItem';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import WorkIcon from '@material-ui/icons/Work';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import MailIcon from '@material-ui/icons/Mail';
import AssessmentIcon from '@material-ui/icons/Assessment';
import firebase from 'firebase';
import { useState } from 'react';

// --------account route
// {
//   href: '/app/account',
//   icon: UserIcon,
//   title: 'Account'
// },
const items = [
  {
    href: '/app/dashboard',
    icon: BarChartIcon,
    title: 'Dashboard'
  },
  {
    href: '/app/updates',
    icon: UpdateIcon,
    title: 'Updates'
  },
  {
    href: '/app/staff',
    icon: AssignmentIndOutlinedIcon,
    title: 'Staff'
  },
  // {
  //   href: '/app/highlights',
  //   icon: HighlightIcon,
  //   title: 'Highlights'
  // },
  {
    href: '/app/achivements',
    icon: AchivementIcon,
    title: 'Achivements'
  },
  {
    href: '/app/activities',
    icon: WorkIcon,
    title: 'Activity'
  },
  {
    href: '/app/academicCalender',
    icon: CalendarTodayIcon,
    title: 'Academic Calendar'
  },
  {
    href: '/app/publication',
    icon: MenuBookIcon,
    title: 'Publication'
  },
  {
    href: '/app/testimonial',
    icon: FormatQuoteIcon,
    title: 'Testimonial'
  },
  {
    href: '/app/committee',
    icon: SupervisedUserCircleIcon,
    title: 'Committee'
  },
  {
    href: '/app/news',
    icon: AnnouncementIcon,
    title: 'News'
  },
  {
    href: '/app/library',
    icon: LibraryBooksIcon,
    title: 'Library'
  },
  {
    href: '/app/placement',
    icon: AttachMoneyIcon,
    title: 'Placement'
  },
  {
    href: '/app/resultnletter',
    icon: AssessmentIcon,
    title: 'Result & Letter'
  },
  {
    href: '/app/email',
    icon: MailIcon,
    title: 'Email'
  }
  // {
  //   href: '/app/settings',
  //   icon: SettingsIcon,
  //   title: 'Settings'
  // }
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const [userData, setUserData] = useState({
    displayName: 'Admin',
    email: ''
  });

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const getUserName = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        user.getIdToken().then(val => {
          console.log(val);
          localStorage.setItem('token', val);
        });
        setUserData({
          displayName: user.displayName,
          email: user.email
        });
      }
    });
  };
  useEffect(() => {
    getUserName();
  }, []);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          to="/app/account"
        >
          {userData.email[0]}
        </Avatar>
        <Typography className={classes.name} color="textPrimary" variant="h5">
          {userData.email}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          Admin
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map(item => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
      <Box p={2} m={2}>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              firebase.auth().signOut();
            }}
          >
            Log Out
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
