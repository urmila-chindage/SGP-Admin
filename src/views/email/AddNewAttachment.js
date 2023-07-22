import {
  Box,
  Card,
  CardHeader,
  Divider,
  makeStyles,
  TextField,
  Typography
} from '@material-ui/core';
import React from 'react';
import { useState } from 'react';
import firebase from 'firebase';
import clsx from 'clsx';
import { store } from 'react-notifications-component';
import Button from '@material-ui/core/Button';

const AddNewAttachment = ({ className, ...rest }) => {
  const useStyles = makeStyles(theme => ({
    root: {
      height: '100%'
    }
  }));

  const [data, setData] = useState({
    fileName: '',
    file: null,
    downloadURL: ''
  });
  const [isDisabled, setIsDisables] = useState(false);
  const classes = useStyles();

  const uploadFileAsync = async (file, storageRef, name) => {
    const ref = storageRef.child('testimonials').child(name);
    const snapshot = await ref.put(file);
    return await snapshot.ref.getDownloadURL();
  };

  const uploadAttachment = async e => {
    setIsDisables(true);
    const storageRef = firebase.storage().ref('emailAttachments');
    if (data.file !== null) {
      const downloadUrl = await uploadFileAsync(
        data.file,
        storageRef,
        data.fileName
      );
      await firebase
        .database()
        .ref('emailAttachments')
        .push({
          fileName: data.fileName,
          downloadURL: downloadUrl
        });
      setData({ ...data, downloadURL: downloadUrl });
      setIsDisables(false);
      store.addNotification({
        title: 'Successful!',
        message: 'Attachment uploaded to firebase',
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
  };

  //   useEffect(() => {}, []);
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Upload Attachment To Cloud" />

      <Divider />
      <TextField
        fullWidth
        label="File Name"
        margin="normal"
        name="filename"
        onChange={e => {
          setData({ ...data, fileName: e.target.value });
        }}
        value={data.fileName}
        variant="outlined"
      />
      <Typography color="textPrimary" variant="h4">
        File:
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        name="file"
        onChange={e => {
          setData({ ...data, file: e.target.files[0] });
        }}
        type="file"
        variant="outlined"
      />
      {data.downloadURL && (
        <Box>
          <Typography color="primary" variant="h5">
            {data.downloadURL}
          </Typography>
        </Box>
      )}
      <Box my={2}>
        <Button
          color="primary"
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={uploadAttachment}
          disabled={isDisabled}
        >
          Upload
        </Button>
      </Box>
    </Card>
  );
};

export default AddNewAttachment;
