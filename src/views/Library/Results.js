import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
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
import { store } from 'react-notifications-component';

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, data, ...rest }) => {
  const classes = useStyles();
  const [selectedData, setSelectedData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const deleteSelectedUpdate = async e => {
    selectedData.forEach((v, i) => {
      data.forEach(async val => {
        if (val.key === v) {
          const dataRef = firebase
            .database()
            .ref('libraryData')
            .child(val.category)
            .child(v);
          const fileRef = firebase
            .storage()
            .ref('libraryData')
            .child(val.FileName);
          await fileRef.delete();
          await dataRef.remove();
          store.addNotification({
            title: 'Successful!',
            message: 'Library Data Deleted',
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
    let newselectedCalendars;

    if (event.target.checked) {
      newselectedCalendars = data.map(update => update.key);
    } else {
      newselectedCalendars = [];
    }

    setSelectedData(newselectedCalendars);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedData.indexOf(id);
    let newselectedCalendars = [];

    if (selectedIndex === -1) {
      newselectedCalendars = newselectedCalendars.concat(selectedData, id);
    } else if (selectedIndex === 0) {
      newselectedCalendars = newselectedCalendars.concat(selectedData.slice(1));
    } else if (selectedIndex === selectedData.length - 1) {
      newselectedCalendars = newselectedCalendars.concat(
        selectedData.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newselectedCalendars = newselectedCalendars.concat(
        selectedData.slice(0, selectedIndex),
        selectedData.slice(selectedIndex + 1)
      );
    }

    setSelectedData(newselectedCalendars);
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

  // useEffect(() => {
  //   console.log(selectedData);
  // }, [selectedData])

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
                    checked={selectedData.length === data.length}
                    color="primary"
                    indeterminate={
                      selectedData.length > 0 &&
                      selectedData.length < data.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Title</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Posted On</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * limit, page * limit + limit)
                .map((calendar, i) => (
                  <TableRow
                    hover
                    key={calendar.key}
                    selected={selectedData.indexOf(calendar.key) !== -1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedData.indexOf(calendar.key) !== -1}
                        onChange={event => handleSelectOne(event, calendar.key)}
                        value="true"
                      />
                    </TableCell>
                    <TableCell>
                      <Box alignItems="center" display="flex">
                        <Typography color="textPrimary" variant="body1">
                          {calendar.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <a href={calendar.fileDownloadURL} target="blank">
                        Open File
                      </a>
                    </TableCell>
                    <TableCell>{calendar.category}</TableCell>
                    <TableCell>
                      {convertTimestampToDate(calendar.postedOn)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={data.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[1, 2, 3, 5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  customers: PropTypes.array.isRequired
};

export default Results;
