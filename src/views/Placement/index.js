import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  Divider,
  Drawer,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  useTheme
} from '@material-ui/core';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import firebase from 'firebase';
import { useEffect } from 'react';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AddPlacement from './AddPlacement';
import PlacementReportCard from './PlacementReportCard';
import { useRef } from 'react';
import clsx from 'clsx';
import { store } from 'react-notifications-component';

const drawerWidth = '80%';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
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

const Placement = ({ className, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [dataWithFiles, setDataWithFiles] = useState([]);
  const [dataWithoutFiles, setDataWithoutFiles] = useState([]);
  const [open, setOpen] = useState(false);
  const [placementOfficer, setPlacementOfficer] = useState({
    name: '',
    image: '',
    description: ''
  });

  const fileRef = useRef(null);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getAllActivities = () => {
    const dbRef = firebase.database().ref('placement');

    //vanila data
    dbRef.child('withoutfiles').on('value', snapshot => {
      if (snapshot.val()) {
        let resultWithoutFiles = Object.values(snapshot.val());
        let keys = Object.keys(snapshot.val());
        keys.forEach((v, i) => {
          resultWithoutFiles[i]['key'] = v;
        });
        // console.log(resultWithoutFiles)
        setDataWithoutFiles(resultWithoutFiles);
      }
    });

    //complex data
    dbRef.child('withFiles').on('value', snapshot => {
      if (snapshot.val()) {
        let resultWithFiles = Object.values(snapshot.val());
        let keys = Object.keys(snapshot.val());
        keys.forEach((v, i) => {
          resultWithFiles[i]['key'] = v;
        });
        // console.log(resultWithFiles)
        setDataWithFiles(resultWithFiles);
      }
    });
  };

  const uploadFile = async (file, reference, name) => {
    const ref = reference.child(name);
    const snapshot = await ref.put(file);
    return snapshot.ref.getDownloadURL();
  };

  const handleImageChange = e => {
    fileRef.current.click();
  };

  const getOfficer = () => {
    firebase
      .database()
      .ref('placementOfficer')
      .on('value', snapshot => {
        if (snapshot.val()) {
          setPlacementOfficer({
            ...placementOfficer,
            name: snapshot.val().name,
            description: snapshot.val().description,
            image: snapshot.val().image
          });
        }
      });
  };

  const setOfficer = () => {
    firebase
      .database()
      .ref('placementOfficer')
      .set(placementOfficer)
      .then(resolved => {
        store.addNotification({
          title: 'Successful!',
          message: 'Placement Officer changed',
          type: 'success',
          insert: 'top',
          container: 'bottom-right',
          animationIn: ['animate__animated', 'animate__fadeIn'],
          animationOut: ['animate__animated', 'animate__fadeOut'],
          dismiss: {
            duration: 6000,
            onScreen: true,
            showIcon: true,
            click: false
          }
        });
      })
      .catch(err => {
        store.addNotification({
          title: 'Error!',
          message: 'Some error occured: ',
          type: 'danger',
          insert: 'top',
          container: 'bottom-right',
          animationIn: ['animate__animated', 'animate__fadeIn'],
          animationOut: ['animate__animated', 'animate__fadeOut'],
          dismiss: {
            duration: 6000,
            onScreen: true,
            showIcon: true,
            click: false
          }
        });
      });
  };

  useEffect(() => {
    getAllActivities();
    getOfficer();
  }, []);

  return (
    <Page className={classes.root} title="Placement">
      <Container maxWidth={false}>
        <Toolbar handleDrawerOpen={handleDrawerOpen} />
        <Card
          className={clsx(classes.root, className)}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
          {...rest}
        >
          <CardHeader title="Placement Officer" />
          <Divider />
          <Avatar alt={placementOfficer.name} src={placementOfficer.image} />
          <Button
            color="primary"
            size="large"
            variant="contained"
            onClick={handleImageChange}
          >
            Change Image
          </Button>
          <input
            type="file"
            name="file"
            id="file"
            hidden
            ref={fileRef}
            onChange={e => {
              let file = e.target.files[0];
              const ref = firebase.storage().ref('placement');
              uploadFile(file, ref, 'officer').then(url => {
                firebase
                  .database()
                  .ref('placementOfficer')
                  .set({
                    ...placementOfficer,
                    image: url
                  });
                store.addNotification({
                  title: 'Successful!',
                  message: 'Placement Officer Image changed',
                  type: 'success',
                  insert: 'top',
                  container: 'bottom-right',
                  animationIn: ['animate__animated', 'animate__fadeIn'],
                  animationOut: ['animate__animated', 'animate__fadeOut'],
                  dismiss: {
                    duration: 6000,
                    onScreen: true,
                    showIcon: true,
                    click: false
                  }
                });
              });
            }}
          />
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            name="this year"
            onChange={e => {
              setPlacementOfficer({
                ...placementOfficer,
                name: e.target.value
              });
            }}
            value={placementOfficer.name}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            name="description"
            onChange={e => {
              setPlacementOfficer({
                ...placementOfficer,
                description: e.target.value
              });
            }}
            value={placementOfficer.description}
            multiline
            rows={5}
            variant="outlined"
          />
          <Box my={2}>
            <Button
              color="primary"
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={setOfficer}
            >
              Set
            </Button>
          </Box>
        </Card>
        <Box mt={3}>
          {dataWithoutFiles.map((d, i) => (
            <PlacementReportCard placement={d} key={i} />
          ))}
          {dataWithFiles.map((d, i) => (
            <PlacementReportCard placement={d} key={i} />
          ))}
        </Box>
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
          <AddPlacement handleDrawerClose={handleDrawerClose} />
        </Drawer>
      </Container>
    </Page>
  );
};

export default Placement;
