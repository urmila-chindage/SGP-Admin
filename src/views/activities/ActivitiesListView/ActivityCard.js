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
import firebase from "firebase"
const useStyles = makeStyles((theme) => ({
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

const ActivityCard = ({ className, activity, ...rest }) => {
  const classes = useStyles();

  const deleteDataWithFiles = (key, fileName, imageNames) => {
      const dbRef = firebase.database().ref('activities').child('withFiles')
      const storageRef = firebase.storage().ref('activities')
      storageRef.child('file').child(fileName).delete()
      .then(() => {
          imageNames.forEach((d,i) => {
              storageRef.child('image').child(d).delete()
          })
      })
      .then(() => {
          dbRef.child(key).remove()
          .then(() => console.log('DELETED SUCCESSFULLY'))
      })
  }

  const deleteDataWithoutFiles = (key) => {
      const dataRef = firebase.database().ref('activities').child('withoutfiles')
      dataRef.child(key).remove().then(() => {
          console.log('DELETED')
      })
  }


  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="center"
          mb={3}
        >
          
          {activity.imagesURLs &&
              activity.imagesURLs.map((d,i) => (
                    <a href={d} target="blank" key={i}>
                        <img
                        alt="Staff"
                        src={d}
                        className={classes.image}
                        />
                    </a>
              ))
          }
        </Box>
        <Typography
          align="center"
          color="textPrimary"
          gutterBottom
          variant="h4"
        >
          {activity.title}
        </Typography>
        <Divider />
        <Typography
          align="center"
          color="textPrimary"
          variant="body1"
        >
          {activity.description}
        </Typography>
        <Divider />
        <Typography
          align="center"
          color="textPrimary"
          variant="body1"
        >
          Type: {" "}{activity.type}
        </Typography>
        <Divider />
        <Typography
          align="center"
          color="textPrimary"
          variant="body1"
        >
          Department: {" "}{activity.dept}
        </Typography>
        <Divider />
        <Typography
          align="center"
          color="textPrimary"
          variant="body1"
        >
          Duration: {" "}{activity.duration}
        </Typography>
        <Divider />
        <Typography
          align="center"
          color="textPrimary"
          variant="body1"
        >
          Category: {" "}{activity.category}
        </Typography>
        <Divider />
        <Typography
          align="center"
          color="textPrimary"
          variant="body1"
        >
          Date: {" "}{activity.date}
        </Typography>
      </CardContent>
      <Box flexGrow={1} />
      <Divider />
      <Box p={2}>
        <Grid
          container
          justify="space-between"
          spacing={2}
        >
        {activity.fileURL && (
          <a href={activity.fileURL} target="blank">
          <Grid
            className={classes.statsItem}
            item
          >
            <GetAppIcon
              className={classes.statsIcon}
              color="action"
            />
            
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
          activity.fileURL ? deleteDataWithFiles(activity.key, activity.fileName, activity.imagesNames) : deleteDataWithoutFiles(activity.key)
        }}
        >
        <Grid
            className={classes.statsItem}
            item
          >
            <DeleteIcon
              className={classes.statsIcon}
              color="action"
            />
            
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

ActivityCard.propTypes = {
  className: PropTypes.string,
  activity: PropTypes.object.isRequired
};

export default ActivityCard;
