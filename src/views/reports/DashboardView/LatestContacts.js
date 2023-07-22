import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  FormControl,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles
} from '@material-ui/core';
import firebase from 'firebase';
import { useEffect } from 'react';
import { deepPurple } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  image: {
    height: 48,
    width: 48
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500]
  }
}));

const LatestContacts = ({ className, ...rest }) => {
  const classes = useStyles();

  const [contacts, setContacts] = useState([]);

  const getcontact = async () => {
    let dataRef = firebase.database().ref('contact');
    dataRef.on('value', dataSnapshot => {
      if (dataSnapshot.val()) {
        let result = Object.values(dataSnapshot.val());

        setContacts(result.reverse());
      }
    });
  };

  useEffect(() => {
    getcontact();
  }, []);

  const getFormatedArray = arr => {
    let combinedData = 'data:text/csv;charset=utf-8, Name, Email, Phone, \r\n';

    arr.forEach((val, idx) => {
      let propertiesArray = [];
      propertiesArray.push(val.name);
      propertiesArray.push(val.email);
      propertiesArray.push(val.phone);
      combinedData += propertiesArray.join(',') + '\r\n';
    });

    return combinedData;
  };

  const handleCSVDownload = e => {
    var link = document.createElement('a');
    let data = getFormatedArray(contacts);
    var encodedUri = encodeURI(data);
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'contacts.csv');
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
      <CardHeader
        subtitle={`${contacts.length} in total`}
        title="Latest contacts"
        action={<DownloadCSV />}
      />
      <Divider />
      <Box
        height="450px"
        display="flex"
        flexDirection="column"
        overflow="scroll"
      >
        <List>
          {contacts.map((val, idx) => (
            <ListItem divider={idx < contacts.length - 1} key={idx}>
              <ListItemAvatar>
                <Avatar className={classes.purple}>{val.name[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={val.name}
                secondary={`Phone No: ${val.phone}`}
              />
              <ListItemText secondary={`Email: ${val.email}`} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider />
    </Card>
  );
};

LatestContacts.propTypes = {
  className: PropTypes.string
};

export default LatestContacts;
