import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  makeStyles,
  colors
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { useState } from 'react';
import { useEffect } from 'react';
import { getThisWeekMetrics } from '../helper/getAnalytics';

const useStyles = makeStyles(() => ({
  root: {}
}));

const WeeklyPerformance = ({ className, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();

  const [data, setData] = useState({
    datasets: [
      {
        backgroundColor: colors.indigo[500],
        data: [18, 5, 19, 27, 29, 19, 30],
        label: 'This week'
      }
    ],
    labels: ['1 Aug', '2 Aug', '3 Aug', '4 Aug', '5 Aug', '6 Aug', '7 Aug']
  });

  useEffect(() => {
    getThisWeekMetrics().then(res => {
      // console.log(res)
      let weeks = [];
      let dates = [];
      res.weekData &&
        res.weekData.forEach(val => {
          weeks.push(val[1]);
          let year = val[0].substring(0, 4);
          let month = val[0].substring(4, 6);
          let day = val[0].substring(6, 8);
          let d = new Date(year, month - 1, day);
          // console.log(d)
          dates.push(
            d.getDate() + ' ' + d.toLocaleString('default', { month: 'short' })
          );
        });
      // console.log(weeks)
      // console.log(dates)
      setData({
        datasets: [
          {
            backgroundColor: colors.indigo[500],
            data: weeks,
            label: 'This week'
          }
        ],
        labels: dates
      });
    });
  }, []);

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,

    scales: {
      xAxes: [
        {
          barThickness: 12,
          maxBarThickness: 10,
          barPercentage: 0.5,
          categoryPercentage: 0.5,
          ticks: {
            fontColor: theme.palette.text.secondary
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 0
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: theme.palette.divider,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: theme.palette.divider
          }
        }
      ]
    },
    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Latest website Hits" />
      <Divider />
      <CardContent>
        <Box height={400} position="relative">
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
      <Divider />
    </Card>
  );
};

WeeklyPerformance.propTypes = {
  className: PropTypes.string
};

export default WeeklyPerformance;
