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
import firebase from "firebase";


const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.dark,
      height: '100%',
      paddingBottom: theme.spacing(3),
      paddingTop: theme.spacing(3)
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }));


const AddCalendar = ({handleDrawerClose}) => {

    const classes = useStyles();
    const [data, setData] = useState({
      department: '',
      year: '',
      sem: '',
      level: '',
      file: undefined,
    })

  
    const uploadFileAsync = async (file, storageRef, name) => {
      const ref = storageRef.child("calendars").child(name);
      const snapshot = await ref.put(file);
      return await snapshot.ref.getDownloadURL();
    };

    return (
        <Page
      className={classes.root}
      title="Calendar"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
                department: '',
                year: '',
                sem: '',
                level: '',
                file: File,
            }}

            onSubmit={async () => {
                // console.log(data);
                let {file, department, level, sem, year} = data;
                const dbReference = firebase.database().ref("academic-calendar").child(department);
                const storageRef = firebase.storage().ref();
                var FileName=""
                var FileURL = "empty";
                if (file !== "") {
                  FileName = uuid();
                  const downloadFileUrl = await uploadFileAsync(file, storageRef, FileName);
                  FileURL = downloadFileUrl;
                }

                var d = {
                  fileDownloadURL: FileURL,
                  FileName,
                  department,
                  level,
                  sem,
                  year,
                  postedOn: firebase.database.ServerValue.TIMESTAMP,
                };

                await dbReference.push(d, (err) => {
                  if (!err) {
                    setData({
                      department: '',
                      year: '',
                      sem: '',
                      level: '',
                      file: undefined,
                    })
                    handleDrawerClose();
                  }
                });
            }}
          >
            {({
              errors,
              handleBlur,
              handleSubmit,
              isSubmitting,
              touched
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Add new Calendar
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.year && errors.year)}
                  fullWidth
                  helperText={touched.year && errors.year}
                  label="Year (YYYY-YY)"
                  margin="normal"
                  name="year"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setData({...data, year: e.target.value});
                  }}
                  value={data.year}
                  variant="outlined"
                />
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">Level</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={(e) => {
                      let val = e.target.value;
                      setData({...data, level: val})
                    }}
                    value={data.level}
                  >
                    <MenuItem value="MSBTE">MSBTE</MenuItem>
                    <MenuItem value="Institute">Institute</MenuItem>
                    <MenuItem value="Department">Department</MenuItem>
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">Department</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={(e) => {
                      let val = e.target.value;
                      setData({...data, department: val})
                    }}
                    value={data.department}
                  >
                    <MenuItem value="Computer Science">Computer Science</MenuItem>
                    <MenuItem value="Mechanical">Mechanical</MenuItem>
                    <MenuItem value="E & TC">E &amp; TC</MenuItem>
                    <MenuItem value="Civil">Civil</MenuItem>
                    <MenuItem value="Electrical">Electrical</MenuItem>
                    <MenuItem value="Basic Science & Humanities">Basic Science &amp; Humanities</MenuItem>
                    <MenuItem value="Library">Library</MenuItem>
                    <MenuItem value="Administrative">Administrative</MenuItem>
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">Sem</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={(e) => {
                      let val = e.target.value;
                      setData({...data, sem: val})
                    }}
                    value={data.sem}
                  >
                    <MenuItem value="Odd">Odd</MenuItem>
                    <MenuItem value="Even">Even</MenuItem>
                  </Select>
                </FormControl>
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
}

export default AddCalendar;
