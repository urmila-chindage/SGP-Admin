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

const CounterValues = ({ className, ...rest }) => {
  const useStyles = makeStyles(theme => ({
    root: {
      height: '100%'
    }
  }));

  const [data, setData] = useState({
    studentThisYear: 0,
    passedStudents: 0,
    certifiedTeachers: 0
  });
  const classes = useStyles();

  const getCounts = () => {
    const dbRef = firebase.database().ref('counterVal');
    dbRef.on('value', datasnapshot => {
      if (datasnapshot.val()) {
        let result = datasnapshot.val();
        setData(result);
      }
    });
  };

  const setCount = () => {
    const dbRef = firebase.database().ref('counterVal');
    dbRef.set(data).then(() => {
      store.addNotification({
        title: 'Successful!',
        message: 'Counter Value Set Successfully',
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
    getCounts();
  }, []);
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Counter Values" />
      <Divider />
      <TextField
        fullWidth
        label="Students This Year"
        margin="normal"
        name="this year"
        onChange={e => {
          setData({ ...data, studentThisYear: e.target.value });
        }}
        value={data.studentThisYear}
        variant="outlined"
      />
      <TextField
        fullWidth
        label="Passed Students"
        margin="normal"
        name="passed students"
        onChange={e => {
          setData({ ...data, passedStudents: e.target.value });
        }}
        value={data.passedStudents}
        variant="outlined"
      />
      <TextField
        fullWidth
        label="Certified Teachers"
        margin="normal"
        name="certified teachers"
        onChange={e => {
          setData({ ...data, certifiedTeachers: e.target.value });
        }}
        value={data.certifiedTeachers}
        variant="outlined"
      />
      <Box my={2}>
        <Button
          color="primary"
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={setCount}
        >
          Set
        </Button>
      </Box>
    </Card>
  );
};

export default CounterValues;
