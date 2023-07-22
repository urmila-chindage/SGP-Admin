import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
    Box,
    Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  makeStyles,
  Typography
} from '@material-ui/core';
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  statsItem: {
    alignItems: 'center',
    display: 'flex'
  },
  statsIcon: {
    marginRight: theme.spacing(1)
  },
  mainImg: {
    alignItems: 'center',

  }
}));

const Results = ({ className, highlights, ...rest }) => {
  const classes = useStyles();
  const [checked, setChecked] = useState([]);

  const handleChange = (i) => {
    let arr = [];
    arr = checked
    console.log(arr)
    arr[i] = !arr[i]
    setChecked(arr);
  };

  useEffect(() => {
    // let toggles = [];
    // highlights.forEach((d) => {
    //   toggles.push(false);
    // })
    // // console.log(toggles)
    // setChecked(toggles);
  }, [])

  // useEffect(() => {
  //   console.log(checked)
  // }, [checked])

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      {highlights.map((d,i) => (
        <Box
        key={i}
        >
          <Button className={classes.mainImg} onClick={() => {handleChange(i)}} >
          <Avatar
          >O</Avatar>
          </Button>
            <Collapse in={checked[i]}>
                <Card
                className={clsx(classes.root, className)}
                {...rest}
                >
                    <CardContent>
                        <Box
                        display="flex"
                        justifyContent="center"
                        mb={3}
                        >
                        <Avatar
                            alt="Staff Image"
                            src={""}
                            variant="square"
                        />
                        </Box>
                        <Typography
                        align="center"
                        color="textPrimary"
                        gutterBottom
                        variant="h4"
                        >
                        {/* {staff.fullName} */}
                        abcd
                        </Typography>
                        <Divider />
                    </CardContent>
                    <Box flexGrow={1} />
                    <Divider />
                </Card>
            </Collapse>
        </Box>
      ))}
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  customers: PropTypes.array.isRequired
};

export default Results;
