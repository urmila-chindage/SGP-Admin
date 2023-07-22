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
  ListItemText
} from '@material-ui/core';
import firebase from 'firebase';
import { useEffect } from 'react';

const useStyles = makeStyles(theme => ({
  root: {},
  actions: {
    justifyContent: 'flex-end'
  }
}));

const LatestSuggestions = ({ className, ...rest }) => {
  const classes = useStyles();

  const [suggestions, setSuggestions] = useState([]);

  const getsuggesstions = async () => {
    let dataRef = firebase.database().ref('suggestion');
    dataRef.on('value', dataSnapshot => {
      if (dataSnapshot.val()) {
        let result = Object.values(dataSnapshot.val());
        setSuggestions(result);
      }
    });
  };

  useEffect(() => {
    getsuggesstions();
  }, []);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Latest Suggestions" />
      <Divider />
      <PerfectScrollbar>
        <Box
          height="450px"
          display="flex"
          flexDirection="column"
          overflow="scroll"
        >
          <List>
            {suggestions.map((val, idx) => (
              <ListItem divider={idx < suggestions.length - 1} key={idx}>
                <ListItemText
                  primary={val.subject}
                  secondary={`Message: ${val.message}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

LatestSuggestions.propTypes = {
  className: PropTypes.string
};

export default LatestSuggestions;
