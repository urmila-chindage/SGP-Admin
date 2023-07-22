import React from 'react';
import { Box, Container, Grid, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Profile from './Profile';
import SendMailToSubscribers from './SendMailToSubscribers';
import AddNewAttachment from './AddNewAttachment';
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const EmailView = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Email">
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item lg={3} md={4} xs={12}>
            <Profile />
          </Grid>
          <Grid item lg={8} md={6} xs={12}>
            {/* <ProfileDetails /> */}
            <Box>
              <SendMailToSubscribers />
            </Box>
            <Box>
              <AddNewAttachment />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default EmailView;
