import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Avatar,
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
import EditIcon from '@material-ui/icons/Edit';

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
  }
}));

const StaffCard = ({
  className,
  staff,
  handleEditDrawerOpen,
  setCurrentlyEditing,
  ...rest
}) => {
  const classes = useStyles();

  const fileRef = useRef(null);
  const imageRef = useRef(null);

  const deleteStaff = async e => {
    await firebase
      .storage()
      .ref('staff-picture')
      .child(staff.commonFileName)
      .delete();
    await firebase
      .storage()
      .ref('files')
      .child(staff.commonFileName)
      .delete();
    await firebase
      .database()
      .ref('staff')
      .child(staff.key)
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

  const handleFileChange = e => {
    fileRef.current.click();
  };

  const handleImageChange = e => {
    imageRef.current.click();
  };

  const changeImageAsync = async image => {
    // const ref = storageRef.child('staff-picture').child(name);
    // const snapshot = await ref.put(image);
    // return await snapshot.ref.getDownloadURL();
    firebase
      .storage()
      .ref()
      .child('staff-picture')
      .child(staff.commonFileName)
      .delete()
      .then(async () => {
        firebase
          .storage()
          .ref()
          .child('staff-picture')
          .child(staff.commonFileName)
          .put(image)
          .then(async snapshot => {
            console.log('Changed');
            store.addNotification({
              title: 'Image Changed!',
              message: 'SUCCESS',
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
      });
  };

  const changeFileAsync = async file => {
    firebase
      .storage()
      .ref()
      .child('files')
      .child(staff.commonFileName)
      .delete()
      .then(async () => {
        firebase
          .storage()
          .ref()
          .child('files')
          .child(staff.commonFileName)
          .put(file)
          .then(snapshot => {
            store.addNotification({
              title: 'Resume Updated!',
              message: 'SUCCESS',
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
        // const snapshot = await ref.put(file);
        // return await snapshot.ref.getDownloadURL();
      });
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Box display="flex" justifyContent="center" mb={3}>
          <Avatar
            alt="Staff Image"
            src={staff.imageDownloadUrl}
            variant="square"
          />
        </Box>
        <Typography
          align="center"
          color="textPrimary"
          gutterBottom
          variant="h4"
        >
          {staff.fullName}
        </Typography>
        <Divider />
        <Typography align="center" color="textPrimary" variant="body1">
          {staff.designation}
        </Typography>
        <Divider />
        <Typography align="center" color="textPrimary" variant="body1">
          {staff.email}
        </Typography>
        <Divider />
        <Typography align="center" color="textPrimary" variant="body1">
          {staff.experience}
        </Typography>
        <Divider />
        <Typography align="center" color="textPrimary" variant="body1">
          {staff.expertise}
        </Typography>
        <Divider />
        <Typography align="center" color="textPrimary" variant="body1">
          {staff.department}
        </Typography>
        <Divider />
        <Typography align="center" color="textPrimary" variant="body1">
          {staff.qualification}
        </Typography>
      </CardContent>
      <Box flexGrow={1} />
      <Divider />
      <Box p={2}>
        <Grid container justify="space-between" spacing={2}>
          <Grid className={classes.statsItem} item>
            <a href={staff.resumeDownloadUrl} target="blank">
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
                Delete Staff
              </Typography>
            </Button>
          </Grid>
          <Grid className={classes.statsItem} item>
            <Button
              onClick={() => {
                setCurrentlyEditing(staff.key);
                console.info(staff.key);
                handleEditDrawerOpen();
              }}
            >
              <EditIcon className={classes.statsIcon} color="action" />
              <Typography
                color="textSecondary"
                display="inline"
                variant="body2"
              >
                Edit Data
              </Typography>
            </Button>
          </Grid>
          <>
            <input
              type="file"
              name="image"
              id="image"
              hidden
              ref={imageRef}
              onChange={e => {
                let file = e.target.files[0];
                // console.log(file);
                // console.log('Clicked on file');
                changeImageAsync(file);
              }}
            />
            <input
              type="file"
              name="file"
              id="file"
              hidden
              ref={fileRef}
              onChange={e => {
                let file = e.target.files[0];
                // console.log(file);
                // console.log('Resume Changed');
                changeFileAsync(file);
              }}
            />
          </>
          <Grid className={classes.statsItem} item>
            <Button onClick={handleImageChange}>
              <EditIcon className={classes.statsIcon} color="action" />
              <Typography
                color="textSecondary"
                display="inline"
                variant="body2"
              >
                Change Image
              </Typography>
            </Button>
          </Grid>
          <Grid className={classes.statsItem} item>
            <Button onClick={handleFileChange}>
              <EditIcon className={classes.statsIcon} color="action" />
              <Typography
                color="textSecondary"
                display="inline"
                variant="body2"
              >
                Change Resume
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

StaffCard.propTypes = {
  className: PropTypes.string,
  staff: PropTypes.object.isRequired
};

export default StaffCard;
