import React from 'react';
import { v4 as uuid } from 'uuid';
import { Formik } from 'formik';
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
  }
}));

const AddUpdate = ({ handleDrawerClose }) => {
  const classes = useStyles();
  const [data, setData] = useState({
    title: '',
    description: '',
    image: File,
    file: File
  });

  var imageuid = '';
  var fileuid = '';

  const uploadImageAsync = async (image, storageRef) => {
    var imguuid = uuid();
    const ref = storageRef.child('images').child(imguuid);
    const snapshot = await ref.put(image);
    imageuid = imguuid;
    return await snapshot.ref.getDownloadURL();
  };

  const uploadFileAsync = async (file, storageRef) => {
    var fuuid = uuid();
    const ref = storageRef.child('files').child(fuuid);
    const snapshot = await ref.put(file);
    fileuid = fuuid;
    return await snapshot.ref.getDownloadURL();
  };

  return (
    <Page className={classes.root} title="Update">
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
              image: File,
              file: File
            }}
            onSubmit={async () => {
              // console.log(data);
              const dbReference = firebase.database().ref('updates');
              const storageRef = firebase.storage().ref();
              var url = 'empty';
              var url2 = 'empty';
              let { title, description, image, file } = data;
              if (image !== '') {
                const downloadUrl = await uploadImageAsync(image, storageRef);
                url = downloadUrl;
              }
              if (file !== '') {
                const downloadFileUrl = await uploadFileAsync(file, storageRef);
                url2 = downloadFileUrl;
              }

              var contact = {
                title: title,
                description: description,
                imageDownloadUrl: url,
                fileDownloadUrl: url2,
                pdfname: fileuid,
                imgname: imageuid,
                postedOn: firebase.database.ServerValue.TIMESTAMP
              };
              await dbReference.push(contact, err => {
                if (!err) {
                  handleDrawerClose();
                }
              });
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography color="textPrimary" variant="h2">
                    Add new Update
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.title && errors.title)}
                  fullWidth
                  helperText={touched.title && errors.title}
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
                <TextField
                  error={Boolean(touched.description && errors.description)}
                  fullWidth
                  helperText={touched.description && errors.description}
                  label="description"
                  margin="normal"
                  name="description"
                  onBlur={handleBlur}
                  onChange={e => {
                    setData({ ...data, description: e.target.value });
                  }}
                  value={data.description}
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
                  name="image"
                  onBlur={handleBlur}
                  onChange={e => {
                    setData({ ...data, image: e.target.files[0] });
                  }}
                  type="file"
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

export default AddUpdate;
