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
  makeStyles,
  Button
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
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
    maxWidth: '350px',
    maxHeight: '350px'
  }
}));

const AchivementCard = ({ className, achivement, ...rest }) => {
  const classes = useStyles();
  const deleteStaff = async e => {
    await firebase
      .storage()
      .ref('achivements')
      .child('images')
      .child(achivement.imageName)
      .delete();
    await firebase
      .storage()
      .ref('achivements')
      .child('files')
      .child(achivement.fileName)
      .delete();
    await firebase
      .database()
      .ref('achivements')
      .child(achivement.key)
      .remove();

    store.addNotification({
      title: 'Successful!',
      message: 'Staff Deleted',
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
  };
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Box display="flex" justifyContent="center" mb={3}>
          <img
            alt="Staff"
            src={achivement.imageURL}
            className={classes.image}
          />
        </Box>
        <Typography
          align="center"
          color="textPrimary"
          gutterBottom
          variant="h4"
        >
          {achivement.title}
        </Typography>
        <Divider />
        <Typography align="center" color="textPrimary" variant="body1">
          Achived By: {achivement.category}
        </Typography>
        <Divider />
        <Typography align="center" color="textPrimary" variant="body1">
          Achived on: {achivement.dateAchived}
        </Typography>
        <Divider />
        <Typography align="center" color="textPrimary" variant="body1">
          Department: {achivement.dept}
        </Typography>
        <Divider />
        <Typography align="center" color="textPrimary" variant="body1">
          {achivement.description}
        </Typography>
      </CardContent>
      <Box flexGrow={1} />
      <Divider />
      <Box p={2}>
        <Grid container justify="space-between" spacing={2}>
          <Grid className={classes.statsItem} item>
            <a href={achivement.fileURL} target="blank">
              <GetAppIcon className={classes.statsIcon} color="action" />

              <Typography
                color="textSecondary"
                display="inline"
                variant="body2"
              >
                Download Resume
              </Typography>
            </a>
          </Grid>
          <Grid className={classes.statsItem} item>
            <Button onClick={deleteStaff}>
              <DeleteIcon className={classes.statsIcon} color="action" />
              <Typography
                color="textSecondary"
                display="inline"
                variant="body2"
              >
                Delete Achievement
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

AchivementCard.propTypes = {
  className: PropTypes.string,
  achivement: PropTypes.object.isRequired
};

export default AchivementCard;
