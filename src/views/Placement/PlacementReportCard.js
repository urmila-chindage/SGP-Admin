import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import firebase from 'firebase';
import { store } from 'react-notifications-component';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  statsItem: {
    alignItems: 'center',
    display: 'flex'
  },
  statsIcon: {
    marginRight: theme.spacing(1)
  },
  image: {
    maxWidth: '200px',
    maxHeight: '200px'
  }
}));

const PlacementReportCard = ({ className, placement, ...rest }) => {
  const classes = useStyles();

  const deleteDataWithFiles = (key, fileName, imageNames) => {
    const dbRef = firebase
      .database()
      .ref('placement')
      .child('withFiles');
    const storageRef = firebase.storage().ref('placement');
    storageRef
      .child('file')
      .child(fileName)
      .delete()
      .then(() => {
        imageNames.forEach((d, i) => {
          storageRef
            .child('image')
            .child(d)
            .delete();
        });
      })
      .then(() => {
        dbRef
          .child(key)
          .remove()
          .then(() => {
            store.addNotification({
              title: 'Successful!',
              message: 'Placement Deleted',
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
      });
  };

  const deleteDataWithoutFiles = key => {
    const dataRef = firebase
      .database()
      .ref('placement')
      .child('withoutfiles');
    dataRef
      .child(key)
      .remove()
      .then(() => {
        store.addNotification({
          title: 'Successful!',
          message: 'Placement Deleted',
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

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Box display="flex" justifyContent="center" mb={3}>
          {placement.imagesURLs &&
            placement.imagesURLs.map((d, i) => (
              <a href={d} target="blank" key={i}>
                <img alt="Staff" src={d} className={classes.image} />
              </a>
            ))}
        </Box>
        <Typography
          align="center"
          color="textPrimary"
          gutterBottom
          variant="h4"
        >
          {placement.title}
        </Typography>
        <Divider />
        <Typography align="center" color="textPrimary" variant="body1">
          {placement.description}
        </Typography>
        <Divider />
        <Typography align="center" color="textPrimary" variant="body1">
          Campus Type: {placement.campusType}
        </Typography>
        <Divider />
        <Typography align="center" color="textPrimary" variant="body1">
          Eligible Departments: {placement.eligibleDept}
        </Typography>
        <Divider />
        <Typography align="center" color="textPrimary" variant="body1">
          Organized By: {placement.organizedBy}
        </Typography>
        <Divider />
        <Typography align="center" color="textPrimary" variant="body1">
          Company Name: {placement.companyName}
        </Typography>
        <Divider />
        <Typography align="center" color="textPrimary" variant="body1">
          Date: {placement.date}
        </Typography>
      </CardContent>
      <Box flexGrow={1} />
      <Divider />
      <Box p={2}>
        <Grid container justify="space-between" spacing={2}>
          {placement.fileURL && (
            <a href={placement.fileURL} target="blank">
              <Grid className={classes.statsItem} item>
                <GetAppIcon className={classes.statsIcon} color="action" />

                <Typography
                  color="textSecondary"
                  display="inline"
                  variant="body2"
                >
                  Download File
                </Typography>
              </Grid>
            </a>
          )}
          <Box
            onClick={e => {
              placement.fileURL
                ? deleteDataWithFiles(
                    placement.key,
                    placement.fileName,
                    placement.imagesNames
                  )
                : deleteDataWithoutFiles(placement.key);
            }}
          >
            <Grid className={classes.statsItem} item>
              <DeleteIcon className={classes.statsIcon} color="action" />

              <Typography
                color="textSecondary"
                display="inline"
                variant="body2"
              >
                Delete Record
              </Typography>
            </Grid>
          </Box>
        </Grid>
      </Box>
    </Card>
  );
};

PlacementReportCard.propTypes = {
  className: PropTypes.string,
  placement: PropTypes.object.isRequired
};

export default PlacementReportCard;
