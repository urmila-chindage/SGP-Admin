import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
  makeStyles,
  colors
} from '@material-ui/core';
import PanToolIcon from '@material-ui/icons/PanTool';
import { useState } from 'react';
import { useEffect } from 'react';
import firebase from 'firebase';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.orange[600],
    height: 56,
    width: 56
  }
}));

const NotRespondedAdmissionReq = ({ className, ...rest }) => {
  const classes = useStyles();

  const [notResponded, setNotResponded] = useState(0);

  const getNotRespondedCount = () => {
    firebase
      .database()
      .ref('admission-req')
      .child('notResponded')
      .once('value', snapshot => {
        setNotResponded(snapshot.numChildren());
      });
  };

  useEffect(() => {
    getNotRespondedCount();
  }, []);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              Pending Admission Req
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {notResponded}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <PanToolIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

NotRespondedAdmissionReq.propTypes = {
  className: PropTypes.string
};

export default NotRespondedAdmissionReq;
