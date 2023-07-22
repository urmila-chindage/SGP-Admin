import React, { useEffect } from 'react';
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

const EditStaff = ({ handleEditDrawerClose, currentStaffId }) => {
  const classes = useStyles();
  const [data, setData] = useState({
    fullName: '',
    designation: '',
    department: '',
    email: '',
    qualification: '',
    expertise: '',
    experience: '',
    imageDownloadUrl: '',
    resumeDownloadUrl: ''
  });
  const [currentFileName, setCurrentFileName] = useState('');
  const [isFiles, setIsFiles] = useState(false);
  // const uploadImageAsync = async (image, storageRef, name, oldName) => {
  //   const ref = storageRef.child('staff-picture').child(name);
  //   await storageRef
  //     .child('staff-picture')
  //     .child(oldName)
  //     .delete();
  //   const snapshot = await ref.put(image);
  //   return await snapshot.ref.getDownloadURL();
  // };

  // const uploadFileAsync = async (file, storageRef, name, oldName) => {
  //   const ref = storageRef.child('files').child(name);
  //   const snapshot = await ref.put(file);
  //   return await snapshot.ref.getDownloadURL();
  // };

  const getStaffData = () => {
    const dbRef = firebase
      .database()
      .ref('staff')
      .child(currentStaffId);
    dbRef.on('value', snapshot => {
      if (snapshot.val()) {
        setData({
          fullName: snapshot.val().fullName,
          designation: snapshot.val().designation,
          department: snapshot.val().department,
          email: snapshot.val().email,
          qualification: snapshot.val().qualification,
          expertise: snapshot.val().expertise,
          experience: snapshot.val().experience,
          imageDownloadUrl: snapshot.val().imageDownloadUrl,
          resumeDownloadUrl: snapshot.val().resumeDownloadUrl
        });
        setCurrentFileName(snapshot.val().commonFileName);
      }
    });
  };

  useEffect(() => {
    getStaffData();
  }, []);

  return (
    <Page className={classes.root} title="Staff">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              fullName: '',
              designation: '',
              department: '',
              email: '',
              qualification: '',
              expertise: '',
              experience: ''
            }}
            onSubmit={async () => {
              // console.log(data);
              const dbReference = firebase
                .database()
                .ref('staff')
                .child(currentStaffId);
              let {
                experience,
                expertise,
                qualification,
                email,
                department,
                designation,
                fullName,
                resumeDownloadUrl,
                imageDownloadUrl
              } = data;

              var d = {
                fullName: fullName,
                designation: designation,
                expertise: expertise,
                experience: experience,
                email: email,
                qualification: qualification,
                department: department,
                postedOn: firebase.database.ServerValue.TIMESTAMP,
                commonFileName: currentFileName,
                resumeDownloadUrl,
                imageDownloadUrl
              };

              await dbReference.set(d, err => {
                if (!err) {
                  handleEditDrawerClose();
                  store.addNotification({
                    title: 'Successful!',
                    message: 'Staff Edited',
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
            {({ errors, handleBlur, handleSubmit, isSubmitting, touched }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography color="textPrimary" variant="h2">
                    Edit Staff Member
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.fullName && errors.fullName)}
                  fullWidth
                  helperText={touched.fullName && errors.fullName}
                  label="Full Name"
                  margin="normal"
                  name="title"
                  onBlur={handleBlur}
                  onChange={e => {
                    setData({ ...data, fullName: e.target.value });
                  }}
                  value={data.fullName}
                  variant="outlined"
                />
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">
                    Designation
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={e => {
                      let val = e.target.value;
                      setData({ ...data, designation: val });
                    }}
                    value={data.designation}
                  >
                    <MenuItem value="HOD">HOD</MenuItem>
                    <MenuItem value="Lecturer">Lecturer</MenuItem>
                    <MenuItem value="Lab Assistant">Lab Assistant</MenuItem>
                    <MenuItem value="Office Superintendent">
                      Office Superintendent
                    </MenuItem>
                    <MenuItem value="Graphics Designer">
                      Graphics Designer
                    </MenuItem>
                    <MenuItem value="Clerk">Clerk</MenuItem>
                    <MenuItem value="Jr. Clerk">Jr. Clerk</MenuItem>
                    <MenuItem value="Senior Accountant">
                      Senior Accountant
                    </MenuItem>
                    <MenuItem value="Account Assistant">
                      Account Assistant
                    </MenuItem>
                    <MenuItem value="Account Clerk">Account Clerk</MenuItem>
                    <MenuItem value="Doctor">Doctor</MenuItem>
                    <MenuItem value="Librarian">Librarian</MenuItem>
                    <MenuItem value="Library Assistant">
                      Library Assistant
                    </MenuItem>
                    <MenuItem value="Jr. Clerk">Jr. Clerk</MenuItem>
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
                      setData({ ...data, department: val });
                    }}
                    value={data.department}
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
                    <MenuItem value="Library">Library</MenuItem>
                    <MenuItem value="Administrative">Administrative</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email"
                  margin="normal"
                  name="Email"
                  onBlur={handleBlur}
                  type="email"
                  onChange={e => {
                    setData({ ...data, email: e.target.value });
                  }}
                  value={data.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.qualification && errors.qualification)}
                  fullWidth
                  helperText={touched.qualification && errors.qualification}
                  label="Qualification"
                  margin="normal"
                  name="Qualification"
                  onBlur={handleBlur}
                  onChange={e => {
                    setData({ ...data, qualification: e.target.value });
                  }}
                  value={data.qualification}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.expertise && errors.expertise)}
                  fullWidth
                  helperText={touched.expertise && errors.expertise}
                  label="Area Of Expertise"
                  margin="normal"
                  name="Area Of Expertise"
                  onBlur={handleBlur}
                  onChange={e => {
                    setData({ ...data, expertise: e.target.value });
                  }}
                  value={data.expertise}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.experience && errors.experience)}
                  fullWidth
                  helperText={touched.experience && errors.experience}
                  label="Experience"
                  margin="normal"
                  name="Experience"
                  onBlur={handleBlur}
                  onChange={e => {
                    setData({ ...data, experience: e.target.value });
                  }}
                  value={data.experience}
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
                    Save
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

export default EditStaff;
