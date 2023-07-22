import React from 'react';
import { v4 as uuid } from 'uuid';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  makeStyles,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Switch
} from '@material-ui/core';
import Page from 'src/components/Page';
import { useState } from 'react';
import firebase from 'firebase';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
var _ = require('lodash');

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

const UploadImage = async (storageref, image, name) => {
  const ref = storageref.child('images').child(name);
  const snapshot = await ref.put(image);
  return snapshot.ref.getDownloadURL();
};
const UploadFile = async (storageref, file, name) => {
  const ref = storageref.child('files').child(name);
  const snapshot = await ref.put(file);
  return snapshot.ref.getDownloadURL();
};

const AddActivity = ({ handleDrawerClose }) => {
  const classes = useStyles();
  const [data, setData] = useState({
    title: '',
    description: '',
    category: '',
    dept: '',
    date: new Date(),
    isFiles: true,
    duration: '',
    type: '',
    file: File,
    images: []
  });
  const [inputCount, setInputCount] = useState({
    count: 1
  });
  var imagesNames = [];
  var imagesURLs = [];

  const uploadImages = async storage => {
    for (let i = 0; i < data.images.length; i++) {
      let name = uuid();
      await uploadFile(data.images[i], storage, name, 'image').then(url => {
        imagesNames.push(name);
        imagesURLs.push(url);
      });
    }
  };

  const uploadFile = async (file, reference, name, type) => {
    const ref = reference.child(type).child(name);
    const snapshot = await ref.put(file);
    return snapshot.ref.getDownloadURL();
  };

  return (
    <Page className={classes.root} title="Activities">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              title: '',
              description: '',
              category: '',
              dept: '',
              date: '',
              isFiles: true,
              duration: '',
              type: '',
              file: File,
              images: []
            }}
            onSubmit={async () => {
              // console.log(data);

              const dbRef = firebase.database().ref('activities');
              const storageRef = firebase.storage().ref('activities');
              if (!data.isFiles) {
                const dataWithoutFiles = {
                  title: data.title,
                  description: data.description,
                  category: data.category,
                  duration: data.duration,
                  dept: data.dept,
                  date:
                    data.date.getDate() +
                    '/' +
                    (data.date.getMonth() + 1) +
                    '/' +
                    data.date.getFullYear(),
                  type: data.type
                };
                dbRef.child('withoutfiles').push(dataWithoutFiles, err => {
                  if (!err) {
                    //console.log('Activity added successfully')
                    handleDrawerClose();
                  }
                });
              } else {
                var FileName = uuid();
                var fileURL;
                uploadFile(data.file, storageRef, FileName, 'file').then(
                  fileurl => {
                    fileURL = fileurl;
                    uploadImages(storageRef).then(() => {
                      const dataWithFiles = {
                        title: data.title,
                        description: data.description,
                        category: data.category,
                        duration: data.duration,
                        dept: data.dept,
                        date:
                          data.date.getDate() +
                          '/' +
                          (data.date.getMonth() + 1) +
                          '/' +
                          data.date.getFullYear(),
                        type: data.type,
                        fileName: FileName,
                        fileURL,
                        imagesNames,
                        imagesURLs
                      };

                      dbRef.child('withFiles').push(dataWithFiles, err => {
                        if (!err) {
                          //console.log('SUCCESS')
                          handleDrawerClose();
                        }
                      });
                    });
                  }
                );
              }
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography color="textPrimary" variant="h2">
                    Add new Activity
                  </Typography>
                </Box>
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
                  label="Description"
                  margin="normal"
                  name="Description"
                  onChange={e => {
                    setData({ ...data, description: e.target.value });
                  }}
                  value={data.description}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Duration"
                  margin="normal"
                  name="Duration"
                  onChange={e => {
                    setData({ ...data, duration: e.target.value });
                  }}
                  value={data.duration}
                  variant="outlined"
                />
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">
                    Event For:{' '}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={e => {
                      let val = e.target.value;
                      setData({ ...data, category: val });
                    }}
                    value={data.category}
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="college">College</MenuItem>
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">
                    Department
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={e => {
                      let val = e.target.value;
                      setData({ ...data, dept: val });
                    }}
                    value={data.dept}
                  >
                    <MenuItem value="Computer Science">
                      Computer Science
                    </MenuItem>
                    <MenuItem value="Mechanical">Mechanical</MenuItem>
                    <MenuItem value="E & TC">E &amp; TC</MenuItem>
                    <MenuItem value="Civil">Civil</MenuItem>
                    <MenuItem value="Electrical">Electrical</MenuItem>
                    <MenuItem value="Basic Science & Humanities">
                      Basic Science &amp; Humanities
                    </MenuItem>
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">Type: </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={e => {
                      let val = e.target.value;
                      setData({ ...data, type: val });
                    }}
                    value={data.type}
                  >
                    <MenuItem value="Visit">Visit</MenuItem>
                    <MenuItem value="Workshop">Workshop</MenuItem>
                    <MenuItem value="Guest Lecture">Guest Lecture</MenuItem>
                    <MenuItem value="Webinar">Webinar</MenuItem>
                    <MenuItem value="Teachers Training">
                      Teachers Training
                    </MenuItem>
                  </Select>
                </FormControl>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    label="Date picker dialog"
                    format="MM/dd/yyyy"
                    value={data.date}
                    onChange={date => {
                      setData({ ...data, date });
                    }}
                    KeyboardButtonProps={{
                      'aria-label': 'change date'
                    }}
                  />
                  <Switch
                    checked={data.isFiles}
                    onChange={e => {
                      setData({ ...data, isFiles: e.target.checked });
                    }}
                    color="primary"
                    name="checkedB"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </MuiPickersUtilsProvider>
                {data.isFiles && (
                  <Box>
                    <Typography color="textPrimary" variant="h4">
                      File:
                    </Typography>
                    <TextField
                      fullWidth
                      margin="normal"
                      name="image"
                      onChange={e => {
                        setData({ ...data, file: e.target.files[0] });
                      }}
                      type="file"
                      variant="outlined"
                    />
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={e => {
                        setInputCount({
                          ...inputCount,
                          count: inputCount.count + 1
                        });
                      }}
                    >
                      +
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={e => {
                        let list = data.images;
                        if (inputCount.count > 1) {
                          if (
                            data.images.length > 0 &&
                            data.images.length === inputCount.count
                          ) {
                            list.splice(data.images.length - 1, 1);
                          }
                          setInputCount({
                            ...inputCount,
                            count: inputCount.count - 1
                          });
                          setData({ ...data, images: list });
                        }
                      }}
                    >
                      -
                    </Button>
                    {_.times(inputCount.count, i => (
                      <TextField
                        fullWidth
                        margin="normal"
                        name="image"
                        onChange={e => {
                          let files = data.images;
                          files[i] = e.target.files[0];
                          setData({ ...data, images: files });
                        }}
                        type="file"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
                {/* <Typography
                    color="textPrimary"
                    variant="h4"
                >
                    Image:
                </Typography>
                <TextField
                  error={Boolean(touched.image && errors.image)}
                  fullWidth
                  helperText={touched.image && errors.image}
                  margin="normal"
                  name="image"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setData({...data, image: e.target.files[0]});
                  }}
                  type="file"
                  variant="outlined"
                />
                <Typography
                    color="textPrimary"
                    variant="h4"
                >
                    File:
                </Typography>
                <TextField
                  error={Boolean(touched.file && errors.file)}
                  fullWidth
                  helperText={touched.file && errors.file}
                  margin="normal"
                  name="file"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setData({...data, file: e.target.files[0]});
                  }}
                  type="file"
                  variant="outlined"
                /> */}
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Add
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default AddActivity;
