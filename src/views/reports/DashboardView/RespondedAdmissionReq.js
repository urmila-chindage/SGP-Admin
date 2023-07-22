import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  colors
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import { useEffect } from 'react';
import { useState } from 'react';
import firebase from 'firebase';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.indigo[600],
    height: 56,
    width: 56
  }
}));

const RespondedAdmissionReq = ({ className, ...rest }) => {
  const classes = useStyles();

  const [responded, setResponded] = useState(0);

  const getRespondedCount = () => {
    firebase
      .database()
      .ref('admission-req')
      .child('Responded')
      .once('value', snapshot => {
        setResponded(snapshot.numChildren());
      });
  };

  useEffect(() => {
    getRespondedCount();
  }, []);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              Responded Admission Req
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {responded}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <CheckIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

RespondedAdmissionReq.propTypes = {
  className: PropTypes.string
};

export default RespondedAdmissionReq;
