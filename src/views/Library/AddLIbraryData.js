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

const AddLibraryData = ({ handleDrawerClose }) => {
  const classes = useStyles();
  const [data, setData] = useState({
    title: '',
    category: '',
    file: undefined
  });

  const uploadFileAsync = async (file, storageRef, name) => {
    const ref = storageRef.child('libraryData').child(name);
    const snapshot = await ref.put(file);
    return await snapshot.ref.getDownloadURL();
  };

  return (
    <Page className={classes.root} title="Calendar">
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
              category: '',
              file: File
            }}
            onSubmit={async () => {
              // console.log(data);
              let { file, category, title } = data;
              const dbReference = firebase
                .database()
                .ref('libraryData')
                .child(category);
              const storageRef = firebase.storage().ref();
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
                fileDownloadURL: FileURL,
                FileName,
                category,
                title,
                postedOn: firebase.database.ServerValue.TIMESTAMP
              };
              await dbReference.push(d, err => {
                if (!err) {
                  setData({
                    title: '',
                    category: '',
                    file: undefined
                  });
                  handleDrawerClose();
                  store.addNotification({
                    title: 'Successful!',
                    message: 'Library Data added',
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
                }
              });
            }}
          >
            {({
              errors,
              handleBlur,
              handleSubmit,
              isSubmitting,
              touched,
              resetForm
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography color="textPrimary" variant="h2">
                    Add Library Data
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.title && errors.title)}
                  fullWidth
                  helperText={touched.title && errors.title}
                  label="title"
                  margin="normal"
                  name="title"
                  onBlur={handleBlur}
                  onChange={e => {
                    setData({ ...data, title: e.target.value });
                  }}
                  value={data.title}
                  variant="outlined"
                />
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">
                    category
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
                    <MenuItem value="REPORT">report</MenuItem>
                    <MenuItem value="ACHIEVEMENT">achievement</MenuItem>
                    <MenuItem value="BOOKBANK">Book Bank</MenuItem>
                  </Select>
                </FormControl>
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

export default AddLibraryData;
