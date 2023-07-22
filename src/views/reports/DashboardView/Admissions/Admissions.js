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
  Tabs
} from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import firebase from 'firebase';
import { useEffect } from 'react';
import AdmissionResult from './AdmissionResult';
import { useState } from 'react';

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
const Admissions = ({ className, ...rest }) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [respondedData, setRespondedData] = useState([]);
  const [notRespondedData, setNotRespondedData] = useState([]);
  const [downloadType, setDownloadType] = useState(null);
  const getData = state => {
    const dbRef = firebase
      .database()
      .ref('admission-req')
      .child(state);
    dbRef.on('value', snapshot => {
      if (snapshot.val()) {
        let result = Object.values(snapshot.val());
        let keys = Object.keys(snapshot.val());
        keys.forEach((val, idx) => {
          result[idx]['key'] = val;
        });
        if (state === 'notResponded') {
          setNotRespondedData(result);
        } else {
          setRespondedData(result);
        }
      }
    });
  };

  useEffect(() => {
    getData('notResponded');
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    getData('Responded');
  };

  const getFormatedArray = arr => {
    let combinedData =
      'data:text/csv;charset=utf-8,Email, Full Name, Address, Caste, SSC Marks, HSC Marks, Phone, Interested Branches, Applied On,\r\n';

    arr.forEach((val, idx) => {
      let propertiesArray = [];
      propertiesArray.push(val.email);
      propertiesArray.push(val.fullName);
      propertiesArray.push(val.address.replaceAll(',', ';'));
      propertiesArray.push(val.caste);
      propertiesArray.push(val.SSCMarks || '-');
      propertiesArray.push(val.hscMarks || '-');
      propertiesArray.push(val.phone);
      propertiesArray.push(val.interestedBranches.join('-'));
      propertiesArray.push(new Date(parseInt(val.timestamp)).toDateString());
      combinedData += propertiesArray.join(',') + '\r\n';
    });

    return combinedData;
  };

  const handleCSVDownload = e => {
    var link = document.createElement('a');
    if (downloadType === 'r') {
      // console.log(respondedData);
      let data = getFormatedArray(respondedData);
      var encodedUri = encodeURI(data);
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'responded.csv');
      document.body.appendChild(link);

      link.click();
    }
    if (downloadType === 'nr') {
      let data = getFormatedArray(notRespondedData);
      var encodedUri = encodeURI(data);
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'notResponded.csv');
      document.body.appendChild(link);
      link.click();
    }
    if (downloadType === 'all') {
      let data = getFormatedArray(notRespondedData.concat(respondedData));
      var encodedUri = encodeURI(data);
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'AllData.csv');
      document.body.appendChild(link);
      link.click();
    }
  };

  const DownloadCSV = () => (
    <Box>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">choose</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={downloadType}
          onChange={e => {
            setDownloadType(e.target.value);
            if (respondedData.length <= 0) {
              getData('Responded');
            }
            if (notRespondedData.length <= 0) {
              getData('notResponded');
            }
          }}
        >
          <MenuItem value="r">Responded</MenuItem>
          <MenuItem value="nr">Not Responded</MenuItem>
          <MenuItem value="all">All</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <Button onClick={handleCSVDownload}>Export CSV</Button>
      </FormControl>
    </Box>
  );

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Admission Requests" action={<DownloadCSV />} />
      <Divider />
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="Not Responded" {...a11yProps(0)} />
            <Tab label="Responded" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <AdmissionResult
            admissions={notRespondedData.reverse()}
            isResponded={false}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <AdmissionResult
            admissions={respondedData.reverse()}
            isResponded={true}
          />
        </TabPanel>
      </div>
    </Card>
  );
};

export default Admissions;
