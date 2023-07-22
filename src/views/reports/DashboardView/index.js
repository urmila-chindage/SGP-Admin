import React from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Subscribers from './Subscribers';
import NotRespondedAdmissionReq from './NotRespondedAdmissionReq';
import RespondedAdmissionReq from './RespondedAdmissionReq';
import TrafficByDevice from './TrafficByDevice';
import TotalHits from './TotalHits';
import WeeklyPerformance from './WeeklyPerformance';
import LatestContacts from './LatestContacts';
import LatestSuggestions from './LatestSuggestions';
import CounterValues from './CounterValues';
import CarouselImages from './CarouselImages';
import Downloads from './downloads/Downloads';
import Admissions from './Admissions/Admissions';
import VidCarousel from './VidCarousel';
import ImgCarousel from './ImgCarousel';
import Recruiters from './Recruiters';
import Headline from './Headline';
import SubscribersList from './SubscribersList';
import AuditReports from './AuditReports/AuditReports';
import Modal from './Modal';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Dashboard = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Subscribers />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalHits />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <NotRespondedAdmissionReq />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <RespondedAdmissionReq />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <WeeklyPerformance />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <TrafficByDevice />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <LatestContacts />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <LatestSuggestions />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <SubscribersList />
          </Grid>
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <Modal />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <CounterValues />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <CarouselImages />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <Headline />
          </Grid>
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <Admissions />
          </Grid>
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <VidCarousel />
          </Grid>
          <Grid item lg={6} md={6} xl={6} xs={6}>
            <ImgCarousel />
          </Grid>
          <Grid item lg={6} md={6} xl={6} xs={6}>
            <Recruiters />
          </Grid>
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <Downloads />
          </Grid>
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <AuditReports />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
