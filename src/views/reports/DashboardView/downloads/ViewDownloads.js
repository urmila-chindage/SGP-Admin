import {
  AppBar,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import firebase from 'firebase';
import { store } from 'react-notifications-component';
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

const ViewDownloads = ({ className, ...rest }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [data, setData] = React.useState([]);

  useEffect(() => {
    fetchAndSetData('Computer Science');
  }, []);

  const fetchAndSetData = async dept => {
    const dbRef = firebase.database().ref('downloads');
    dbRef.child(dept).on('value', snapshot => {
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

  const handleChange = async (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        fetchAndSetData('Computer Science');
        break;
      case 1:
        fetchAndSetData('E & TC');
        break;
      case 2:
        fetchAndSetData('Mechanical');
        break;
      case 3:
        fetchAndSetData('Electrical');
        break;
      case 4:
        fetchAndSetData('Civil');
        break;
      case 5:
        fetchAndSetData('Basic Science & Humanities');
        break;
    }
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="CSE" {...a11yProps(0)} />
            <Tab label="E & TC" {...a11yProps(1)} />
            <Tab label="Mech" {...a11yProps(1)} />
            <Tab label="Ele" {...a11yProps(1)} />
            <Tab label="Civil" {...a11yProps(1)} />
            <Tab label="FY" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <Results downloads={data} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Results downloads={data} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Results downloads={data} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Results downloads={data} />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Results downloads={data} />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <Results downloads={data} />
        </TabPanel>
      </div>
    </Card>
  );
};

export default ViewDownloads;
