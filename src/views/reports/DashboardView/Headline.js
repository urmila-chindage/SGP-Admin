import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  makeStyles,
  TextField
} from '@material-ui/core';
import React from 'react';
import { useState } from 'react';
import firebase from 'firebase';
import clsx from 'clsx';
import { useEffect } from 'react';
import { store } from 'react-notifications-component';

const Headline = ({ className, ...rest }) => {
  const useStyles = makeStyles(theme => ({
    root: {
      height: '100%'
    }
  }));

  const [data, setData] = useState({
    headline: ''
  });
  const classes = useStyles();

  const getHeadline = () => {
    const dbRef = firebase.database().ref('marquee');
    dbRef.on('value', datasnapshot => {
      if (datasnapshot.val()) {
        let result = datasnapshot.val();
        setData(result);
      }
    });
  };

  const setHeadline = () => {
    const dbRef = firebase.database().ref('marquee');
    dbRef.set(data).then(() => {
      store.addNotification({
        title: 'Successful!',
        message: 'Headline Set Successfully',
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
  };

  useEffect(() => {
    getHeadline();
  }, []);
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Marquee Headline" />
      <Divider />
      <TextField
        fullWidth
        label="Enter headline"
        margin="normal"
        name="this year"
        onChange={e => {
          setData({ ...data, headline: e.target.value });
        }}
        value={data.headline}
        variant="outlined"
        multiline={true}
        rows={7}
      />
      <Box my={2}>
        <Button
          color="primary"
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={setHeadline}
        >
          Set
        </Button>
      </Box>
    </Card>
  );
};

export default Headline;
