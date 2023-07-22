import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import { useEffect } from 'react';
import { getThisMonthMetrics } from '../helper/getAnalytics';
import { useState } from 'react';
import { ArrowDownward } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.green[600],
    height: 56,
    width: 56
  },
  positiveDifferenceIcon: {
    color: colors.green[900]
  },
  negativeDifferenceIcon: {
    color: colors.red[900]
  },
  differenceValue: {
    color: colors.green[900],
    marginRight: theme.spacing(1)
  }
}));

const TotalHits = ({ className, ...rest }) => {
  const classes = useStyles();

  const [data, setData] = useState({count: 0, diff: 0})

  useEffect(() => {
    getThisMonthMetrics()
    .then(res => {
      console.log(res)
      setData({count: parseInt(res.count), diff: Math.round(res.diff)});
    })
  }, [])

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              TOTAL HITS 
            <Typography
            color="textSecondary"
            variant="caption"
            >
            {"   "}(This 30 Days)
          </Typography>
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {data.count}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <PeopleIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box
          mt={2}
          display="flex"
          alignItems="center"
        >
          {
            data.diff < 0 ? (<ArrowDownward className={classes.negativeDifferenceIcon} />) : (<ArrowUpwardIcon className={classes.positiveDifferenceIcon} />)
          }
          <Typography
            className={classes.differenceValue}
            variant="body2"
          >
            {data.diff}%
          </Typography>
          <Typography
            color="textSecondary"
            variant="caption"
          >
            Since last 30 Days
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

TotalHits.propTypes = {
  className: PropTypes.string
};

export default TotalHits;
