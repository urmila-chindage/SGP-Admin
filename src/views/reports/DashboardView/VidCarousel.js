import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  TextField
} from '@material-ui/core';
import React from 'react';
import clsx from 'clsx';
import { deepPurple } from '@material-ui/core/colors';
import { useState } from 'react';
import firebase from 'firebase';
import { store } from 'react-notifications-component';
import { useEffect } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  image: {
    height: 48,
    width: 48
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500]
  }
}));
const VidCarousel = ({ className, ...rest }) => {
  const classes = useStyles();

  const [data, setData] = useState({
    title: '',
    url: ''
  });
  const [allData, setAllData] = useState([]);

  const getAllVideos = () => {
    const dbRef = firebase.database().ref('videoCarousel');
    dbRef.on('value', snapshot => {
      if (snapshot.val()) {
        let result = Object.values(snapshot.val());
        let keys = Object.keys(snapshot.val());
        keys.forEach((val, idx) => {
          result[idx]['key'] = val;
        });
        setAllData(result);
      }
    });
  };

  useEffect(() => {
    getAllVideos();
  }, []);

  const deleteItem = key => {
    const item = firebase
      .database()
      .ref('videoCarousel')
      .child(key);
    item
      .remove()
      .then(() => {
        store.addNotification({
          title: 'Deleted!',
          message: 'Item Deleted Successfully',
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
          title: 'Failed to Delete',
          message: err.message,
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

  const addYoutubeVideo = async () => {
    const dbRef = firebase.database().ref('videoCarousel');
    if (data.title !== '' && data.url !== '') {
      await dbRef.push(data, err => {
        if (!err) {
          setData({ ...data, title: '', url: '' });
          store.addNotification({
            title: 'Successful!',
            message: 'Video URL uploaded Successfully',
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
        }
      });
    } else {
      store.addNotification({
        title: 'Error!',
        message: 'All fields are required',
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
    }
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Grid spacing={1} container>
        <Grid item lg={4} md={4} xl={12} xs={12}>
          <Card className={clsx(classes.root)}>
            <CardHeader title="Add Video" />
            <Divider />
            <TextField
              fullWidth
              label="Title"
              margin="normal"
              name="title"
              onChange={e => {
                setData({ ...data, title: e.target.value });
              }}
              value={data.title}
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Video URL"
              margin="normal"
              FormHelperTextProps="help"
              name="url"
              onChange={e => {
                setData({ ...data, url: e.target.value });
              }}
              value={data.url}
              variant="outlined"
              required
            />
            <Box my={2}>
              <Button
                color="primary"
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                onClick={addYoutubeVideo}
              >
                Add
              </Button>
            </Box>
          </Card>
        </Grid>
        <Grid item lg={8} md={8} xl={12} xs={12}>
          <Card className={clsx(classes.root)}>
            <CardHeader subtitle={`in total`} title="All Videos" />
            <Divider />
            <Box
              height="450px"
              display="flex"
              flexDirection="column"
              overflow="scroll"
            >
              <List>
                {allData &&
                  allData.map((val, idx) => (
                    <ListItem divider={idx < allData.length - 1} key={val.key}>
                      <ListItemAvatar>
                        <Avatar className={classes.purple}>
                          {val.title[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <Grid container>
                        <Grid item lg={8} md={8} xl={12} xs={12}>
                          <ListItemText primary={val.title} />
                        </Grid>
                        <Grid item lg={4} md={4} xl={4} xs={4}>
                          <ListItemText secondary>
                            <Button
                              variant="outlined"
                              color="primary"
                              href={val.url}
                              target="blank"
                            >
                              Open Video
                            </Button>
                          </ListItemText>
                        </Grid>
                      </Grid>
                      <Button
                        variant="outlilned"
                        color="secondary"
                        onClick={() => {
                          deleteItem(val.key);
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </ListItem>
                  ))}
              </List>
            </Box>
            <Divider />
          </Card>
        </Grid>
      </Grid>
    </Card>
  );
};

export default VidCarousel;
