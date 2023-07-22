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

const AddResultnLetterData = ({ handleDrawerClose }) => {
  const classes = useStyles();
  const [data, setData] = useState({
    description: '',
    title: '',
    sem: '',
    level: '',
    file: undefined,
    category: ''
  });

  const uploadFileAsync = async (file, storageRef, name) => {
    const ref = storageRef.child(name);
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
              description: '',
              title: '',
              sem: '',
              level: '',
              file: '',
              category: ''
            }}
            onSubmit={async () => {
              // console.log(data);
              let { file, description, level, sem, title, category } = data;
              const dbReference = firebase
                .database()
                .ref('resultnletter')
                .child(category);
              const storageRef = firebase
                .storage()
                .ref('resultnletter')
                .child(category);
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
                description,
                level,
                sem,
                title,
                category,
                postedOn: firebase.database.ServerValue.TIMESTAMP
              };

              await dbReference.push(d, err => {
                if (!err) {
                  setData({
                    description: '',
                    title: '',
                    sem: '',
                    level: '',
                    file: '',
                    category: ''
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
                    Add new Result/News Letter
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
                  error={Boolean(touched.title && errors.title)}
                  fullWidth
                  helperText={touched.title && errors.title}
                  label="Description"
                  margin="normal"
                  name="description"
                  onBlur={handleBlur}
                  onChange={e => {
                    setData({ ...data, description: e.target.value });
                  }}
                  value={data.description}
                  variant="outlined"
                  multiline={true}
                  rows={3}
                />
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">Level</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={e => {
                      let val = e.target.value;
                      setData({ ...data, level: val });
                    }}
                    value={data.level}
                  >
                    <MenuItem value="MSBTE">MSBTE</MenuItem>
                    <MenuItem value="Institute">Institute</MenuItem>
                    <MenuItem value="Department">Department</MenuItem>
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">Sem</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={e => {
                      let val = e.target.value;
                      setData({ ...data, sem: val });
                    }}
                    value={data.sem}
                  >
                    <MenuItem value="Odd">Odd</MenuItem>
                    <MenuItem value="Even">Even</MenuItem>
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
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
                    <MenuItem value="Result">Result</MenuItem>
                    <MenuItem value="Letter">News Letter</MenuItem>
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

export default AddResultnLetterData;
