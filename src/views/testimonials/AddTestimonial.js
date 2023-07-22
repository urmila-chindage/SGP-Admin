import React from 'react';
import { Formik } from 'formik';
import { v4 as uuid } from 'uuid';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import { useState } from 'react';
import firebase from 'firebase';

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

const AddTestimonial = ({ handleDrawerClose }) => {
  const classes = useStyles();
  const [data, setData] = useState({
    name: '',
    work: '',
    message: '',
    image: undefined
  });

  const uploadFileAsync = async (file, storageRef, name) => {
    const ref = storageRef.child('testimonials').child(name);
    const snapshot = await ref.put(file);
    return await snapshot.ref.getDownloadURL();
  };

  return (
    <Page className={classes.root} title="Testimonials">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              name: '',
              work: '',
              message: '',
              image: undefined
            }}
            onSubmit={async () => {
              // console.log(data);
              let { name, work, message, image } = data;
              const dbReference = firebase.database().ref('testimonials');
              const storageRef = firebase.storage().ref();

              var FileName = '';
              var FileURL = 'empty';
              if (image !== '') {
                FileName = uuid();
                const downloadFileUrl = await uploadFileAsync(
                  image,
                  storageRef,
                  FileName
                );
                FileURL = downloadFileUrl;
              }

              var d = {
                name,
                work,
                message,
                FileURL,
                FileName,
                postedOn: firebase.database.ServerValue.TIMESTAMP
              };

              await dbReference.push(d, err => {
                if (!err) {
                  setData({
                    name: '',
                    work: '',
                    message: '',
                    image: undefined
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
                    Add new Testimonial
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  label="Name"
                  margin="normal"
                  name="name"
                  onBlur={handleBlur}
                  onChange={e => {
                    setData({ ...data, name: e.target.value });
                  }}
                  value={data.name}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Work"
                  margin="normal"
                  name="work"
                  onBlur={handleBlur}
                  onChange={e => {
                    setData({ ...data, work: e.target.value });
                  }}
                  value={data.work}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Message"
                  margin="normal"
                  name="message"
                  onBlur={handleBlur}
                  onChange={e => {
                    setData({ ...data, message: e.target.value });
                  }}
                  value={data.message}
                  variant="outlined"
                />
                <Typography color="textPrimary" variant="h4">
                  Image:
                </Typography>
                <TextField
                  error={Boolean(touched.image && errors.image)}
                  fullWidth
                  helperText={touched.image && errors.image}
                  margin="normal"
                  name="Image"
                  onBlur={handleBlur}
                  onChange={e => {
                    setData({ ...data, image: e.target.files[0] });
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

export default AddTestimonial;
