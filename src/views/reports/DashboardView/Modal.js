import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  TextField,
  useTheme,
  makeStyles
} from '@material-ui/core';
import React from 'react';
import { useState } from 'react';
import firebase from 'firebase';
import { useEffect } from 'react';
import { useRef } from 'react';
import { store } from 'react-notifications-component';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));
const Modal = ({ className, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [modalData, setModalData] = useState({
    imageURL: '',
    moreInfoURL: ''
  });

  const fileRef = useRef(null);

  const handleImageChange = e => {
    fileRef.current.click();
  };

  const uploadFile = async (file, reference, name) => {
    const ref = reference.child(name);
    const snapshot = await ref.put(file);
    return snapshot.ref.getDownloadURL();
  };

  const setModal = () => {
    firebase
      .database()
      .ref('modal')
      .set(modalData)
      .then(resolved => {
        store.addNotification({
          title: 'Successful!',
          message: 'Modal Data Changed',
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
          message: 'Some error occured ',
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

  const getModalData = () => {
    firebase
      .database()
      .ref('modal')
      .on('value', snapshot => {
        if (snapshot.val()) {
          setModalData({
            ...modalData,
            imageURL: snapshot.val().imageURL,
            moreInfoURL: snapshot.val().moreInfoURL
          });
        }
      });
  };

  useEffect(() => {
    getModalData();
  }, []);

  return (
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
      <CardHeader title="Modal Window" />
      <Divider />
      <Avatar alt={modalData.imageURL} src={modalData.imageURL} />
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
          const ref = firebase.storage().ref('modalData');
          uploadFile(file, ref, 'modal').then(url => {
            firebase
              .database()
              .ref('modal')
              .set({
                ...modalData,
                imageURL: url
              });
            store.addNotification({
              title: 'Successful!',
              message: 'Modal Image Changed',
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
        label="More Info Link"
        margin="normal"
        name="this year"
        onChange={e => {
          setModalData({
            ...modalData,
            moreInfoURL: e.target.value
          });
        }}
        value={modalData.moreInfoURL}
        variant="outlined"
      />
      <Box my={2}>
        <Button
          color="primary"
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={setModal}
        >
          Set
        </Button>
      </Box>
    </Card>
  );
};

export default Modal;
