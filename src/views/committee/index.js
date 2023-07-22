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
import firebase from "firebase"
import { useEffect } from 'react';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AddCommittee from './AddCommittee';
import Results from './Results';


const drawerWidth = "80%";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
}));

const Committee = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [committees, setcommittees] = useState([]);
  const [open, setOpen] = useState(false);

  const getAllcommittees = () => {
    const dbRef = firebase.database().ref('committees');
    dbRef.on("value", snapshot => {
        let result = Object.values(snapshot.val());
        let keys = Object.keys(snapshot.val());
        keys.forEach((v,i) => {
            result[i]["key"] = v;
        })
        result.forEach((d,i) => {
          let committeeMembers = Object.values(d.committeeMembers);
          result[i].committeeMembers = committeeMembers;
        })
        // console.log(result);
        setcommittees(result)
    })
}

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getAllcommittees();
  }, [])


  return (
    <Page
      className={classes.root}
      title="Committee"
    >
      <Container maxWidth={false}>
        <Toolbar handleDrawerOpen={handleDrawerOpen}/>
        <Box mt={3}>
          <Results committees={committees} />
        </Box>
        <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        {/* <AddAchivement handleDrawerClose={handleDrawerClose} /> */}
        <AddCommittee handleDrawerClose={handleDrawerClose} />
      </Drawer>
      </Container>
    </Page>
  );
};

export default Committee;
