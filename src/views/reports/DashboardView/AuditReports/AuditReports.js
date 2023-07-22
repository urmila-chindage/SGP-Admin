import {
  AppBar,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  makeStyles,
  Tab,
  Tabs,
  TextField
} from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import firebase from 'firebase';
import { v4 as uuid } from 'uuid';
import { store } from 'react-notifications-component';
import ViewAuditReports from './ViewAuditReports';

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

function AddAuditReport() {
  const [data, setData] = React.useState({
    title: '',
    file: null
  });

  const uploadFile = async (file, reference, name) => {
    const ref = reference.child(name);
    const snapshot = await ref.put(file);
    return snapshot.ref.getDownloadURL();
  };

  const onSubmit = () => {
    // console.log(data);
    let { title, dept, year, file } = data;
    if (title !== '' || dept !== '' || year !== '' || file !== null) {
      let dbRef = firebase.database().ref('auditReports');
      let storageRef = firebase.storage().ref('auditReports');
      var FileName = uuid();
      var fileURL;
      uploadFile(file, storageRef, FileName)
        .then(url => {
          fileURL = url;
          let obj = {
            title,
            FileName,
            fileURL,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          };
          dbRef.push(obj, err => {
            if (!err) {
              store.addNotification({
                title: 'Successful!',
                message: 'Audit report added successfully',
                type: 'success',
                insert: 'top',
                container: 'bottom-right',
                animationIn: ['animate__animated', 'animate__fadeIn'],
                animationOut: ['animate__animated', 'animate__fadeOut'],
                dismiss: {
                  duration: 5000,
                  onScreen: true,
                  showIcon: true,
                  click: false
                }
              });
              setData({
                title: '',
                dept: '',
                year: '',
                file: null
              });
            } else {
              store.addNotification({
                title: 'Oops!',
                message:
                  "File uploaded but occured error while saving ref. delete file from storage at 'downloads-file'",
                type: 'danger',
                insert: 'top',
                container: 'bottom-right',
                animationIn: ['animate__animated', 'animate__fadeIn'],
                animationOut: ['animate__animated', 'animate__fadeOut'],
                dismiss: {
                  duration: 60000,
                  onScreen: true,
                  showIcon: true,
                  click: false
                }
              });
            }
          });
        })
        .catch(err => {
          store.addNotification({
            title: 'Oops!',
            message: 'some error occured while uploading',
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
    } else {
      store.addNotification({
        title: 'Oops!',
        message: 'All fields are required',
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
    }
  };

  const classes = useStyles();
  return (
    <Box m={2}>
      <TextField
        fullWidth
        label="Title"
        margin="normal"
        name="title"
        onChange={e => {
          setData({ ...data, title: e.target.value });
        }}
        value={data.title}
        variant="outlined"
      />
      <TextField
        fullWidth
        margin="normal"
        name="image"
        onChange={e => {
          let file = e.target.files[0];
          setData({ ...data, file: file });
        }}
        type="file"
        variant="outlined"
      />
      <Box my={2}>
        <Button
          color="primary"
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={onSubmit}
        >
          Upload
        </Button>
      </Box>
    </Box>
  );
}

const AuditReports = ({ className, ...rest }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Audit Reports" />
      <Divider />
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="Add Audit Report" {...a11yProps(0)} />
            <Tab label="List Audit Reports" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <AddAuditReport />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ViewAuditReports />
        </TabPanel>
      </div>
    </Card>
  );
};

export default AuditReports;
