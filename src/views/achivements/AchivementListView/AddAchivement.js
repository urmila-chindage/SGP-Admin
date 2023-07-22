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

  const UploadImage = async (storageref, image, name) => {
    const ref = storageref.child('images').child(name)
    const snapshot = await ref.put(image);
    return snapshot.ref.getDownloadURL();
  }
  const UploadFile = async (storageref, file, name) => {
      const ref = storageref.child('files').child(name)
      const snapshot = await ref.put(file);
      return snapshot.ref.getDownloadURL();
  }


const AddAchivement = ({handleDrawerClose}) => {

    const classes = useStyles();
    const [data, setData] = useState({
        title: '',
        description: '',
        image: File,
        file: File,
        category: '',
        dept: '',
        dateAchived: ''
    })

    return (
        <Page
      className={classes.root}
      title="Achivement"
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
                title: '',
                description: '',
                image: File,
                file: File,
                category: '',
                dept: '',
                dateAchived: ''
            }}

            onSubmit={async () => {
                // console.log(data);

                const dbRef = firebase.database().ref('achivements')
                const storageref = firebase.storage().ref('achivements')
                var imageURL = 'empty'
                var fileURL = 'empty'
                var imageName = uuid();
                var fileName = uuid();

                if(data.image.length !== 0) {
                  imageURL = await UploadImage(storageref, data.image, imageName);
                }
                if(data.file.length !== 0) {
                    fileURL = await UploadFile(storageref, data.file, fileName);
                }

                const d = {
                  title: data.title,
                  description: data.description,
                  category: data.category,
                  dept: data.dept,
                  dateAchived: data.dateAchived,
                  imageURL: imageURL,
                  fileURL: fileURL,
                  fileName: fileName,
                  imageName: imageName
              }
      
              await dbRef.push(d, (err) => {
                  if(!err){
                      // console.log('ADDED');
                      setData({
                          title: '',
                          description: '',
                          category: '',
                          dateAchived: '',
                          image: File,
                          file: File,
                          dept: ''
                      })
                      handleDrawerClose();
                  }
              })
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
                    Add new Achivement
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.fullName && errors.fullName)}
                  fullWidth
                  helperText={touched.fullName && errors.fullName}
                  label="Title"
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
                  error={Boolean(touched.fullName && errors.fullName)}
                  fullWidth
                  helperText={touched.fullName && errors.fullName}
                  label="Description"
                  margin="normal"
                  name="Description"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setData({...data, description: e.target.value});
                  }}
                  value={data.description}
                  variant="outlined"
                />
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">Category</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={(e) => {
                      let val = e.target.value;
                      setData({...data, category: val})
                    }}
                    value={data.category}
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="college">College</MenuItem>
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">Department</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={(e) => {
                      let val = e.target.value;
                      setData({...data, dept: val})
                    }}
                    value={data.dept}
                  >
                    <MenuItem value="Computer Science">Computer Science</MenuItem>
                    <MenuItem value="Mechanical">Mechanical</MenuItem>
                    <MenuItem value="E & TC">E &amp; TC</MenuItem>
                    <MenuItem value="Civil">Civil</MenuItem>
                    <MenuItem value="Electrical">Electrical</MenuItem>
                    <MenuItem value="Basic Science & Humanities">Basic Science &amp; Humanities</MenuItem>
                  </Select>
                </FormControl>
                <Typography
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

export default AddAchivement;
