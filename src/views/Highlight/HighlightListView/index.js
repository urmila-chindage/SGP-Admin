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
import Results from './Results';
import Toolbar from './Toolbar';
import firebase from "firebase"
import { useEffect } from 'react';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

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

const HighlightListView = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [highlights, setHighlights] = useState([]);
  const [open, setOpen] = useState(false);

  const getAllHighlights = async () => {
    const dbRef = firebase.database().ref('story');

    dbRef.on('value',datasnapshot => {
        if(datasnapshot.val()){
            let result = Object.values(datasnapshot.val());
            let resultKeys = Object.keys(datasnapshot.val());

            resultKeys.forEach((value,key) => {
                result[key]['key'] = value;
            })
            let storyData = []
            result.forEach((v,i) => {
                let list = Object.values(v.storyData);
                let listKeys = Object.keys(v.storyData);
                listKeys.forEach((value,index) =>{
                    list[index]['key'] = value;
                })
                storyData.push(list);
            })
            setHighlights(result);
        }
    })
}

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
      getAllHighlights();
  }, [])

//   useEffect(() => {
//     console.log(highlights);
//   }, [highlights])

  return (
    <Page
      className={classes.root}
      title="Highlights"
    >
      <Container maxWidth={false}>
        <Toolbar openDrawer={handleDrawerOpen}/>
        <Box mt={3}>
          <Results highlights={highlights} />
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
      </Drawer>
      </Container>
    </Page>
  );
};

export default HighlightListView;
