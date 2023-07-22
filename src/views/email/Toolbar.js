import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Avatar, Box, Button, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));

const Toolbar = ({ className, handleDrawerOpen, ...rest }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box display="flex" justifyContent="flex-end">
        <Box alignItems="center" display="flex" flexDirection="column" p={2}>
          <Avatar>A</Avatar>
          <Typography className={classes.name} color="textPrimary" variant="h5">
            admin@gmail.com
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
