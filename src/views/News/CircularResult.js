import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { store } from 'react-notifications-component';
import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles,
  Button
} from '@material-ui/core';
import firebase from 'firebase';

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const CircularResult = ({ className, circulars, ...rest }) => {
  const classes = useStyles();
  const [selectedCirculars, setSelectedCirculars] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);

  const deleteSelectedUpdate = async e => {
    selectedCirculars.forEach((v, i) => {
      circulars.forEach(async val => {
        if (val.key === v) {
          const dataRef = firebase
            .database()
            .ref('circular')
            .child(v);
          const fileRef = firebase
            .storage()
            .ref('news')
            .child(val.FileName);
          await fileRef.delete();
          await dataRef.remove();
          store.addNotification({
            title: 'Successful!',
            message: 'Circular deleted',
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
        }
      });
    });
  };

  const handleSelectAll = event => {
    let newselectedCirculars;

    if (event.target.checked) {
      newselectedCirculars = circulars.map(update => update.key);
    } else {
      newselectedCirculars = [];
    }

    setSelectedCirculars(newselectedCirculars);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCirculars.indexOf(id);
    let newselectedCirculars = [];

    if (selectedIndex === -1) {
      newselectedCirculars = newselectedCirculars.concat(selectedCirculars, id);
    } else if (selectedIndex === 0) {
      newselectedCirculars = newselectedCirculars.concat(
        selectedCirculars.slice(1)
      );
    } else if (selectedIndex === selectedCirculars.length - 1) {
      newselectedCirculars = newselectedCirculars.concat(
        selectedCirculars.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newselectedCirculars = newselectedCirculars.concat(
        selectedCirculars.slice(0, selectedIndex),
        selectedCirculars.slice(selectedIndex + 1)
      );
    }

    setSelectedCirculars(newselectedCirculars);
  };

  const handleLimitChange = event => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const convertTimestampToDate = tmstp => {
    let d = new Date(tmstp);
    let date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    return date;
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Button
        color="secondary"
        variant="contained"
        onClick={deleteSelectedUpdate}
      >
        Delete Selected
      </Button>
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCirculars.length === circulars.length}
                    color="primary"
                    indeterminate={
                      selectedCirculars.length > 0 &&
                      selectedCirculars.length < circulars.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Content</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Posted On</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {circulars
                .slice(page * limit, page * limit + limit)
                .map((circular, i) => (
                  <TableRow
                    hover
                    key={i}
                    selected={selectedCirculars.indexOf(circular.key) !== -1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedCirculars.indexOf(circular.key) !== -1}
                        onChange={event => handleSelectOne(event, circular.key)}
                        value="true"
                      />
                    </TableCell>
                    <TableCell>
                      <Box alignItems="center" display="flex">
                        <Typography color="textPrimary" variant="body1">
                          {circular.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <a href={circular.FileURL} target="blank">
                        Open File
                      </a>
                    </TableCell>
                    <TableCell>
                      {convertTimestampToDate(circular.postedOn)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={circulars.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[1, 2, 3, 5, 10, 25]}
      />
    </Card>
  );
};

CircularResult.propTypes = {
  className: PropTypes.string,
  customers: PropTypes.array.isRequired
};

export default CircularResult;
