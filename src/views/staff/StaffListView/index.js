import React, { useState } from 'react';
import {
  Box,
  Container,
  Drawer,
  Grid,
  IconButton,
  makeStyles,
  useTheme
} from '@material-ui/core';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import firebase from 'firebase';
import { useEffect } from 'react';
import StaffCard from './StaffCard';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AddStaff from './AddStaff';
import EditStaff from './EditStaff';

const drawerWidth = '80%';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  staffCard: {
    height: '100%'
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: drawerWidth
  },
  title: {
    flexGrow: 1
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginRight: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: 0
  }
}));

const StaffList = () => {
  const classes = useStyles();
  const [staffMembers, setStaffMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentlyEditing, setCurrentlyEditing] = useState('');
  const theme = useTheme();

  const getAllStaff = () => {
    const dbRef = firebase.database().ref('staff');
    dbRef.on('value', datasnapshot => {
      if (datasnapshot.val()) {
        let staff = Object.values(datasnapshot.val());
        let keys = Object.keys(datasnapshot.val());
        keys.forEach((v, i) => {
          staff[i]['key'] = v;
        });
        // console.log(staff);
        setStaffMembers(staff);
      }
    });
  };

  useEffect(() => {
    getAllStaff();
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleEditDrawerOpen = () => {
    setIsEditOpen(true);
  };

  const handleEditDrawerClose = () => {
    setIsEditOpen(false);
  };

  return (
    <Page className={classes.root} title="Staff">
      <Container maxWidth={false}>
        <Toolbar handleDrawerOpen={handleDrawerOpen} />
        <Box mt={3}>
          <Grid container spacing={3}>
            {staffMembers.map(staff => (
              <Grid item key={staff.key} lg={4} md={6} xs={12}>
                <StaffCard
                  className={classes.staffCard}
                  staff={staff}
                  handleEditDrawerOpen={handleEditDrawerOpen}
                  setCurrentlyEditing={setCurrentlyEditing}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box mt={3} display="flex" justifyContent="center"></Box>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="right"
          open={open}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <AddStaff handleDrawerClose={handleDrawerClose} />
        </Drawer>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="right"
          open={isEditOpen}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleEditDrawerClose}>
              {theme.direction === 'rtl' ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          {Boolean(isEditOpen && currentlyEditing !== '') && (
            <EditStaff
              handleEditDrawerClose={handleEditDrawerClose}
              currentStaffId={currentlyEditing}
            />
          )}
        </Drawer>
      </Container>
    </Page>
  );
};

export default StaffList;
