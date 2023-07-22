import React, { useState } from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  makeStyles,
  List,
  ListItem,
  ListItemText,
  FormControl,
  Button
} from '@material-ui/core';
import firebase from 'firebase';
import { useEffect } from 'react';

const useStyles = makeStyles(theme => ({
  root: {},
  actions: {
    justifyContent: 'flex-end'
  }
}));

const SubscribersList = ({ className, ...rest }) => {
  const classes = useStyles();

  const [subscribers, setSubScribers] = useState([]);

  const getAllSubScribers = async () => {
    let dataRef = firebase.database().ref('subscribers');
    dataRef.on('value', dataSnapshot => {
      if (dataSnapshot.val()) {
        let result = Object.values(dataSnapshot.val());
        setSubScribers(result);
      }
    });
  };

  const convertTimestampToDate = tmstp => {
    let d = new Date(tmstp);
    let date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    return date;
  };

  useEffect(() => {
    getAllSubScribers();
  }, []);

  const getFormatedArray = arr => {
    let combinedData =
      'data:text/csv;charset=utf-8, Email, Subscribed On, \r\n';

    arr.forEach((val, idx) => {
      let propertiesArray = [];
      propertiesArray.push(val.email);
      propertiesArray.push(convertTimestampToDate(val.subscribedOn));
      combinedData += propertiesArray.join(',') + '\r\n';
    });

    return combinedData;
  };

  const handleCSVDownload = e => {
    var link = document.createElement('a');
    let data = getFormatedArray(subscribers);
    var encodedUri = encodeURI(data);
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'subscribers.csv');
    document.body.appendChild(link);

    link.click();
  };

  const DownloadCSV = () => (
    <Box>
      <FormControl className={classes.formControl}>
        <Button onClick={handleCSVDownload}>Export CSV</Button>
      </FormControl>
    </Box>
  );

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="SubScribers" action={<DownloadCSV />} />
      <Divider />
      <Box
        height="450px"
        display="flex"
        flexDirection="column"
        overflow="scroll"
      >
        <List>
          {subscribers.map((val, idx) => (
            <ListItem divider={idx < subscribers.length - 1} key={idx}>
              <ListItemText
                primary={val.email}
                secondary={`SubScribed On: ${convertTimestampToDate(
                  val.subscribedOn
                )}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Card>
  );
};

SubscribersList.propTypes = {
  className: PropTypes.string
};

export default SubscribersList;
