import React from 'react';

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


const AddPublication = ({handleDrawerClose}) => {

    const classes = useStyles();
    const [data, setData] = useState({
      department: '',
      year: '',
      name: '',
      platform: '',
      title: '',
      publishedBy: '',
      category: ''
    })


    return (
        <Page
      className={classes.root}
      title="Publication"
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
              name: '',
              platform: '',
              title: '',
              publishedBy: '',
              category: ''
            }}

            onSubmit={async () => {
                console.log(data);
                let {department, year, name, platform, title, publishedBy, category} = data;
                const dbReference = firebase.database().ref("publications").child(department);
                const storageRef = firebase.storage().ref();

                var d = {
                  department,
                  year,
                  name,
                  platform,
                  title,
                  publishedBy,
                  category,
                  postedOn: firebase.database.ServerValue.TIMESTAMP,
                };

                await dbReference.push(d, (err) => {
                  if (!err) {
                    setData({
                      department: '',
                      year: '',
                      name: '',
                      platform: '',
                      title: '',
                      category: '',
                      publishedBy: ''
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
                    Add new Publication
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  label="Title of Publication"
                  margin="normal"
                  name="title"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setData({...data, title: e.target.value});
                  }}
                  value={data.title}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Name Of Publisher(eg. john, doe)"
                  margin="normal"
                  name="name"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setData({...data, name: e.target.value});
                  }}
                  value={data.name}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Year Of Publication(YYYY)"
                  margin="normal"
                  name="year"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setData({...data, year: e.target.value});
                  }}
                  value={data.year}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Platform Name(Journal)"
                  margin="normal"
                  name="journal"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setData({...data, platform: e.target.value});
                  }}
                  value={data.platform}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Category (eg. book | paper)"
                  margin="normal"
                  name="category"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setData({...data, category: e.target.value});
                  }}
                  value={data.type}
                  variant="outlined"
                />
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
                  <InputLabel id="demo-simple-select-label">Published By</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={(e) => {
                      let val = e.target.value;
                      setData({...data, publishedBy: val})
                    }}
                    value={data.publishedBy}
                  >
                    <MenuItem value="Faculty">Faculty</MenuItem>
                    <MenuItem value="Student">Student</MenuItem>
                  </Select>
                </FormControl>
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

export default AddPublication;
