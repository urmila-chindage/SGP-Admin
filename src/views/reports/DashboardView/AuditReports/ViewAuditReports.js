import { Box, Card, makeStyles } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import firebase from 'firebase';
import Results from './Results';
import { useEffect } from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  floatingBtn: {
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    float: 'right'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

const ViewAuditReports = ({ className, ...rest }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [data, setData] = React.useState([]);

  useEffect(() => {
    fetchAndSetData();
  }, []);

  const fetchAndSetData = async () => {
    const dbRef = firebase.database().ref('auditReports');
    dbRef.on('value', snapshot => {
      if (snapshot.val()) {
        let result = Object.values(snapshot.val());
        let keys = Object.keys(snapshot.val());
        keys.forEach((v, i) => {
          result[i]['key'] = v;
        });
        setData(result);
      } else {
        setData([]);
      }
    });
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <div className={classes.root}>
        <Results items={data} />
      </div>
    </Card>
  );
};

export default ViewAuditReports;
