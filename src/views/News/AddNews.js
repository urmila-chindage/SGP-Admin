import React from 'react';
import { Formik } from 'formik';
import { v4 as uuid } from 'uuid';
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
  Select
} from '@material-ui/core';
import Page from 'src/components/Page';
import { useState } from 'react';
import firebase from 'firebase';
import { store } from 'react-notifications-component';

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

const AddNews = ({ handleDrawerClose }) => {
  const classes = useStyles();
  const [data, setData] = useState({
    title: '',
    file: null,
    category: 'news'
  });

  const uploadFileAsync = async (file, storageRef, name) => {
    const ref = storageRef.child('news').child(name);
    const snapshot = await ref.put(file);
    return await snapshot.ref.getDownloadURL();
  };

  return (
    <Page className={classes.root} title="News">
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
              file: null,
              category: ''
            }}
            onSubmit={async () => {
              console.log(data);
              let { title, file, category } = data;
              var dbReference;

              const storageRef = firebase.storage().ref();
              if (category === 'news') {
                dbReference = firebase.database().ref('news');
              } else {
                dbReference = firebase.database().ref('circular');
              }
              var FileName = '';
              var FileURL = 'empty';
              if (file !== '') {
                FileName = uuid();
                const downloadFileUrl = await uploadFileAsync(
                  file,
                  storageRef,

                  FileName
                );
                FileURL = downloadFileUrl;
              }

              var d = {
                title,
                FileURL,
                FileName,

                postedOn: firebase.database.ServerValue.TIMESTAMP
              };

              await dbReference.push(d, err => {
                if (!err) {
                  setData({
                    title: '',
                    file: undefined
                  });
                  store.addNotification({
                    title: 'Successful!',
                    message: 'Data Uploaded',
                    type: 'success',
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
                  handleDrawerClose();
                }
              });
            }}
          >
            {({ errors, handleBlur, handleSubmit, isSubmitting, touched }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography color="textPrimary" variant="h2">
                    Add new News
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  label="Title"
                  margin="normal"
                  name="title"
                  onBlur={handleBlur}
                  onChange={e => {
                    setData({ ...data, title: e.target.value });
                  }}
                  value={data.title}
                  variant="outlined"
                />

                <Typography color="textPrimary" variant="h4">
                  File:
                </Typography>
                <TextField
                  error={Boolean(touched.file && errors.file)}
                  fullWidth
                  helperText={touched.file && errors.file}
                  margin="normal"
                  name="file"
                  onBlur={handleBlur}
                  onChange={e => {
                    setData({ ...data, file: e.target.files[0] });
                  }}
                  type="file"
                  variant="outlined"
                />

                {/* <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">
                    Category
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
                    <MenuItem value="news">News</MenuItem>
                    <MenuItem value="circular">circular</MenuItem>
                  </Select>
                </FormControl> */}
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

export default AddNews;
