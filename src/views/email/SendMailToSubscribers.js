import {
  Box,
  Card,
  CardHeader,
  Divider,
  makeStyles,
  TextField
} from '@material-ui/core';
import React from 'react';
import { useState } from 'react';
import clsx from 'clsx';
import { store } from 'react-notifications-component';
import Button from '@material-ui/core/Button';

const SendMailToSubscribers = ({ className, ...rest }) => {
  const useStyles = makeStyles(theme => ({
    root: {
      height: '100%'
    }
  }));

  const [data, setData] = useState({
    subject: '',
    html: ''
  });
  const [isDisabled, setIsDisables] = useState(false);
  const classes = useStyles();

  const sendMail = async () => {
    setIsDisables(true);
    let html = data.html;
    html = html.replaceAll('"', "'");
    const { subject } = data;
    console.log(html);
    console.log(data);
    let obj = {
      subject,
      html
    };
    const authToken = localStorage.getItem('token');
    fetch('https://sgpbackend.herokuapp.com/mail/sendMailToSubscribers', {
      method: 'post',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    })
      .then(res => {
        console.table(res);
        setIsDisables(false);
        store.addNotification({
          title: 'Successful!',
          message: 'Email Sent to all subscribers successfully',
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
      })
      .catch(err => {
        console.error(err);
        store.addNotification({
          title: 'Some Error Occured',
          message: err,
          type: 'danger',
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
      });
  };

  const previewEmail = () => {
    let html = data.html;
    html = html.replaceAll('"', "'");
    let win = window.open('', '', 'width=auto, height=auto');
    win.document.write(html);
  };

  //   useEffect(() => {}, []);
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Send Email To All Subscribers" />

      <Divider />
      <TextField
        fullWidth
        label="Subject"
        margin="normal"
        name="subject"
        onChange={e => {
          setData({ ...data, subject: e.target.value });
        }}
        value={data.subject}
        variant="outlined"
      />
      <TextField
        id="outlined-multiline-static"
        label="Enter HTML (enter html with inline/internal CSS only)"
        fullWidth
        multiline
        rows={10}
        variant="outlined"
        onChange={e => {
          setData({ ...data, html: e.target.value });
        }}
        value={data.html}
      />
      <Box my={2}>
        <Button
          color="primary"
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={sendMail}
          disabled={isDisabled}
        >
          Send
        </Button>
        <Button
          fullWidth
          size="large"
          variant="contained"
          style={{ backgroundColor: '#35BDD0' }}
          onClick={previewEmail}
        >
          Preview
        </Button>
      </Box>
    </Card>
  );
};

export default SendMailToSubscribers;
