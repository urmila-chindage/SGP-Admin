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
} from '@material-ui/core';
import Page from 'src/components/Page';
import { useState } from 'react';
import firebase from "firebase";
var _ = require('lodash');


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


const AddCommittee = ({handleDrawerClose}) => {

    const classes = useStyles();
    const [data, setData] = useState({
      year: '',
      committeeName: '',
      committeeMembers: [
        {
          name: '',
          designation: ''
        }
      ]
    })
    const [inputCount,setInputCount] = useState({
      count:1
    })


  

    return (
        <Page
      className={classes.root}
      title="Committee"
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
              year: '',
              committeeName: '',
              committeeMembers: []
            }}
            onSubmit={async () => {
                console.log(data);
                
                const dbRef = firebase.database().ref('committees');
                dbRef.push(data, (err) => {
                  if(!err) {
                    setInputCount({
                      count: 1
                    })
                    setData({
                      year: '',
                      committeeName: '',
                      committeeMembers: [
                        {
                          name: '',
                          designation: ''
                        }
                      ]
                    })
                    handleDrawerClose();
                  }
                })
            }}
          >
            {({              
              handleSubmit,
              isSubmitting,
            }) => (
              <Box
              display="flex"
              flexDirection="column"
              overflow="scroll"
              height="600px"
              >
              <form 
              onSubmit={handleSubmit}
              
              >
                <Box 
                mb={3}
                >
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Add new Committee
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  label="Committee Name"
                  margin="normal"
                  name="name"
                  onChange={(e) => {
                    setData({...data, committeeName: e.target.value});
                  }}
                  value={data.committeeName}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Year(YYYY-YY)"
                  margin="normal"
                  name="year"
                  onChange={(e) => {
                    setData({...data, year: e.target.value});
                  }}
                  value={data.year}
                  variant="outlined"
                />
                    <Box>
          <Button variant="outlined" color="primary"
          onClick={e => {
            setInputCount({...inputCount, count: inputCount.count + 1})
            let obj = {
              name: '',
              designation: ''
            }
            let members = data.committeeMembers;
            members.push(obj);
            setData({...data, committeeMembers: members})
          }}
          >
            +
          </Button>
          <Button variant="outlined" color="secondary"
          onClick={e => {
            let list = data.committeeMembers
            if(inputCount.count > 1){
              if(data.committeeMembers.length > 0 && data.committeeMembers.length === inputCount.count) {
                  list.splice(data.committeeMembers.length - 1, 1);
              }
              setInputCount({...inputCount, count: inputCount.count - 1})
              setData({...data, committeeMembers: list})
            }
          }}
          >
            -
          </Button>
          {_.times(inputCount.count, i => (
            <Box border={2} borderColor="secondary.main" m={0.5} p={0.5}>
              <TextField
              fullWidth
              label="Member Name"
              margin="normal"
              name="name"
              onChange={(e) => {
                let members = data.committeeMembers
                members[i]["name"] = e.target.value
                setData({...data, committeeMembers: members});
              }}
              value={data.committeeMembers[i].name}
              variant="outlined"
            />
              <TextField
              fullWidth
              label="Designation"
              margin="normal"
              name="designation"
              onChange={(e) => {
                let members = data.committeeMembers
                members[i]["designation"] = e.target.value
                setData({...data, committeeMembers: members});
              }}
              value={data.committeeMembers[i].designation}
              variant="outlined"
            />
          </Box>
          ))}
      </Box>
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
              </Box>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
    );
}

export default AddCommittee;
