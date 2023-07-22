import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  colors,
  makeStyles,
  useTheme
} from '@material-ui/core';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import PhoneIcon from '@material-ui/icons/Phone';
import TabletIcon from '@material-ui/icons/Tablet';
import { useEffect } from 'react';
import {getDeviceCategoryMetric} from "../helper/getAnalytics"
import { useState } from 'react';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  }
}));

const TrafficByDevice = ({ className, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();

  const [data, setData] = useState({
    datasets: [
      {
        data: [63, 0, 37],
        backgroundColor: [
          colors.indigo[500],
          colors.red[600],
          colors.orange[600]
        ],
        borderWidth: 8,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white
      }
    ],
    labels: ['Desktop', 'Tablet', 'Mobile']
  })

  useEffect(() => {
    getDeviceCategoryMetric()
    .then(res => {
      // console.log(res);
      let obj = {
        desktop: 90,
        mobile: 10,
        tablet: 0
      }
      res.browserMetrics && res.browserMetrics.forEach(val => {
        obj[val[0]] = val[2]
        // console.log(val)
      })
      setData({datasets: [{ data: [obj.desktop, obj.tablet, obj.mobile], 
        backgroundColor: [
          colors.indigo[500],
          colors.red[600],
          colors.orange[600]
        ],
        borderWidth: 8,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white
      }]})
    })
  }, [])


  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
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

  const icons = [
    <LaptopMacIcon color="primary" />,
    <TabletIcon color="error" />,
    <PhoneIcon style={{color: "orange"}} />
  ]

  const devices = [
    {
      title: 'Desktop',
      value: 63,
      Icon: LaptopMacIcon,
      color: colors.indigo[500]
    },
    {
      title: 'Tablet',
      value: 15,
      Icon: TabletIcon,
      color: colors.red[600]
    },
    {
      title: 'Mobile',
      value: 23,
      Icon: PhoneIcon,
      color: colors.orange[600]
    }
  ];

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader title="Traffic by Device" />
      <Divider />
      <CardContent>
        <Box
          height={300}
          position="relative"
        >
          <Doughnut
            data={data}
            options={options}
          />
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          mt={2}
        >
          {data && data.datasets[0].data.map((val, idx) => (
            <Box
              key={idx}
              p={1}
              textAlign="center"
            >
              {/* <Icon color="action" /> */}
              {(icons[idx])}
              <Typography
                variant="body1"
              >
                {devices[idx].title}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

TrafficByDevice.propTypes = {
  className: PropTypes.string
};

export default TrafficByDevice;
