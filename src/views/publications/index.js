
import React, { useState } from 'react';
import {
  Box,
  Container,
  Drawer,
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
import AddPublication from "./AddPublication";
import Results from './Results';

const drawerWidth = "80%";

const useStyles = makeStyles((theme) => ({
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
  }
}));

const PublicationsList = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const theme = useTheme();

  const getFormatedObject = (obj) => {
    if(obj){
    let result = Object.values(obj);
    return result
    }
    return []
}
  const getFormatedKeys = (obj) => {
    if(obj){
    let result = Object.keys(obj);
    return result
    }
    return []
}

const getPublicationsSorted = (arr) => {
    if(arr){
    let sorted = arr.sort((a,b) => b.year - a.year)
    return sorted
    }
    return []
}


  const getAllPublications = () => {
    const dbRef = firebase.database().ref("publications")
    dbRef.on("value", datasnapshot => {
        if(datasnapshot.val()){
            // console.log(datasnapshot.val());
            let cse = getFormatedObject(datasnapshot.val()["Computer Science"])
            let cseKeys = getFormatedKeys(datasnapshot.val()["Computer Science"])
            cseKeys.forEach((val,idx) => {
              cse[idx]["key"] = val;
            })
            cse = getPublicationsSorted(cse)

            let mech = getFormatedObject(datasnapshot.val()["Mechanical"])
            let mechKeys = getFormatedKeys(datasnapshot.val()["Mechanical"])
            mechKeys.forEach((val,idx) => {
              mech[idx]["key"] = val;
            })
            mech = getPublicationsSorted(mech)

            let cvl = getFormatedObject(datasnapshot.val()["Civil"])
            let cvlKeys = getFormatedKeys(datasnapshot.val()["Civil"])
            cvlKeys.forEach((val,idx) => {
              cvl[idx]["key"] = val;
            })
            cvl = getPublicationsSorted(cvl)

            let entc = getFormatedObject(datasnapshot.val()["E & TC"])
            let entcKeys = getFormatedKeys(datasnapshot.val()["E & TC"])
            entcKeys.forEach((val,idx) => {
              entc[idx]["key"] = val;
            })
            entc = getPublicationsSorted(entc);

            let ele = getFormatedObject(datasnapshot.val()["Electrical"])
            let eleKeys = getFormatedKeys(datasnapshot.val()["Electrical"])
            eleKeys.forEach((val,idx) => {
              ele[idx]["key"] = val;
            })
            ele = getPublicationsSorted(ele);

            let fy = getFormatedObject(datasnapshot.val()["Basic Science & Humanities"])
            let fyKeys = getFormatedKeys(datasnapshot.val()["Basic Science & Humanities"])
            fyKeys.forEach((val,idx) => {
              fy[idx]["key"] = val;
            })
            fy = getPublicationsSorted(fy);
            
            let all = [...cse, ...mech, ...cvl, ...entc, ...ele, ...fy];


            setData(all);
            
        }
    })
}

  useEffect(() => {
    getAllPublications()
  }, [])

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Page
      className={classes.root}
      title="Publication"
      
    >
      <Container maxWidth={false}>
        <Toolbar handleDrawerOpen={handleDrawerOpen} />
        <Box mt={3}>
          <Results publications={data} />
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
        <AddPublication handleDrawerClose={handleDrawerClose} />
      </Drawer>
      </Container>
    </Page>
  );
};

export default PublicationsList;
