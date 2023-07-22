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

const AddPlacement = ({ handleDrawerClose }) => {
  const classes = useStyles();
  const [data, setData] = useState({
    title: '',
    description: '',
    eligibleDept: '',
    organizedBy: '',
    companyName: '',
    campusType: '',
    date: new Date(),
    isFiles: true,
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
    <Page className={classes.root} title="Placement">
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
              eligibleDept: '',
              organizedBy: '',
              companyName: '',
              campusType: '',
              date: new Date(),
              isFiles: true,
              file: File,
              images: []
            }}
            onSubmit={async () => {
              // console.log(data);

              const dbRef = firebase.database().ref('placement');
              const storageRef = firebase.storage().ref('placement');
              if (!data.isFiles) {
                const dataWithoutFiles = {
                  title: data.title,
                  description: data.description,
                  eligibleDept: data.eligibleDept,
                  organizedBy: data.organizedBy,
                  companyName: data.companyName,
                  campusType: data.campusType,
                  date:
                    data.date.getDate() +
                    '/' +
                    (data.date.getMonth() + 1) +
                    '/' +
                    data.date.getFullYear()
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
                        eligibleDept: data.eligibleDept,
                        organizedBy: data.organizedBy,
                        companyName: data.companyName,
                        campusType: data.campusType,
                        date:
                          data.date.getDate() +
                          '/' +
                          (data.date.getMonth() + 1) +
                          '/' +
                          data.date.getFullYear(),
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
                    Add new Placement
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
                  label="Eligible Departments"
                  margin="normal"
                  name="Eligible"
                  onChange={e => {
                    setData({ ...data, eligibleDept: e.target.value });
                  }}
                  value={data.eligibleDept}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Organized By (EG: Sanjay Ghodawat Polytechnic)"
                  margin="normal"
                  name="OrganizedBy"
                  onChange={e => {
                    setData({ ...data, organizedBy: e.target.value });
                  }}
                  value={data.organizedBy}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Company Name"
                  margin="normal"
                  name="companyName"
                  onChange={e => {
                    setData({ ...data, companyName: e.target.value });
                  }}
                  value={data.companyName}
                  variant="outlined"
                />
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">
                    Campus Type:{' '}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={e => {
                      let val = e.target.value;
                      setData({ ...data, campusType: val });
                    }}
                    value={data.campusType}
                  >
                    <MenuItem value="Off Campus">Off Campus</MenuItem>
                    <MenuItem value="On Campus">On Campus</MenuItem>
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

export default AddPlacement;
