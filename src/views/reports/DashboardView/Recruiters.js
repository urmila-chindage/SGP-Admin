import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Container,
  Divider,
  Fab,
  Grid,
  IconButton,
  makeStyles,
  TextField
} from '@material-ui/core';
import React from 'react';
import { useState } from 'react';
import firebase from 'firebase';
import clsx from 'clsx';
import { useEffect } from 'react';
import { store } from 'react-notifications-component';
import AddIcon from '@material-ui/icons/Add';
import { v4 as uuid } from 'uuid';

const Recruiters = ({ className, ...rest }) => {
  const useStyles = makeStyles(theme => ({
    root: {
      height: '100%'
    },
    floatingBtn: {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      float: 'right'
    }
  }));

  const [data, setData] = useState([]);
  const classes = useStyles();

  const handleButtonClick = () => {
    let ele = document.getElementById('recruiters-file');
    ele.click();
  };

  const getCarouselImages = () => {
    const dbRef = firebase.database().ref('recruiters');
    dbRef.on('value', datasnapshot => {
      if (datasnapshot.val()) {
        let result = Object.values(datasnapshot.val());
        let keys = Object.keys(datasnapshot.val());
        keys.forEach((d, i) => {
          result[i]['key'] = d;
        });
        setData(result);
      }
    });
  };

  const uploadFile = async (file, name) => {
    let reference = firebase.storage().ref('RecruitersImages');
    const ref = reference.child(name);
    const snapshot = await ref.put(file);
    return snapshot.ref.getDownloadURL();
  };

  const saveRef = (url, name) => {
    const ref = firebase.database().ref('recruiters');
    let obj = {
      URL: url,
      ImageName: name
    };
    ref.push(obj, err => {
      if (!err) {
        store.addNotification({
          title: "'Successful!",
          message: 'recruiters Image Uploaded Successfully',
          type: 'success',
          insert: 'top',
          container: 'bottom-right',
          animationIn: ['animate__animated', 'animate__fadeIn'],
          animationOut: ['animate__animated', 'animate__fadeOut'],
          dismiss: {
            duration: 5000,
            onScreen: true,
            showIcon: true,
            click: false
          }
        });
      }
    });
  };

  const handleDelete = idx => {
    const dataRef = firebase
      .database()
      .ref('recruiters')
      .child(data[idx].key);
    const fileRef = firebase
      .storage()
      .ref('RecruitersImages')
      .child(data[idx].ImageName);
    fileRef
      .delete()
      .then(() => {
        dataRef
          .remove()
          .then(() => {
            store.addNotification({
              title: "'Successful!",
              message: 'Image Deleted from recruiters',
              type: 'success',
              insert: 'top',
              container: 'bottom-right',
              animationIn: ['animate__animated', 'animate__fadeIn'],
              animationOut: ['animate__animated', 'animate__fadeOut'],
              dismiss: {
                duration: 5000,
                onScreen: true,
                showIcon: true,
                click: false
              }
            });
          })
          .catch(err => {
            store.addNotification({
              title: "'Error Occured!",
              message:
                'Some Error occured while deleting reference of image from realtime db(remove ref from db)',
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
      })
      .catch(err => {
        store.addNotification({
          title: "'Error Occured!",
          message:
            'Some Error occured while deleting Image from firebase Storage',
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
    getCarouselImages();
  }, []);
  // useEffect(() => {
  //   console.log(data)
  // }, [data])
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="recruiters Images" />
      <Divider />
      <Box m={3}>
        {data.map((val, idx) => (
          <Chip
            color="primary"
            avatar={<Avatar alt="Natacha" src={val.URL} />}
            label={idx + 1}
            onClick={() => {
              window.open(val.URL, 'width=200, height=200');
            }}
            onDelete={() => {
              handleDelete(idx);
            }}
            key={val.key}
          />
        ))}
      </Box>
      <TextField
        fullWidth
        label="Students This Year"
        margin="normal"
        name="this year"
        type="file"
        id="recruiters-file"
        onChange={async e => {
          let file = e.target.files[0];
          var FileName = uuid();
          uploadFile(file, FileName).then(url => {
            saveRef(url, FileName);
          });
        }}
        style={{ display: 'none' }}
      />
      <Box my={2} bottom="0" width="100%" position="relative">
        <Button
          color="primary"
          fullWidth
          size="large"
          variant="contained"
          onClick={handleButtonClick}
        >
          <AddIcon />
        </Button>
      </Box>
    </Card>
  );
};

export default Recruiters;
