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

const Results = ({ className, downloads, ...rest }) => {
  const classes = useStyles();
  const [selecteddownloads, setselecteddownloads] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const deleteSelectedUpdate = async e => {
    selecteddownloads.forEach((v, i) => {
      downloads.forEach(async val => {
        if (val.key === v) {
          const dataRef = firebase
            .database()
            .ref('downloads')
            .child(val.dept)
            .child(v);
          const fileRef = firebase
            .storage()
            .ref('Downloads-file')
            .child(val.FileName);
          await fileRef.delete();
          await dataRef.remove();
          store.addNotification({
            title: 'Successful!',
            message: 'Download Deleted successfully',
            type: 'success',
            insert: 'top',
            container: 'bottom-right',
            animationIn: ['animate__animated', 'animate__fadeIn'],
            animationOut: ['animate__animated', 'animate__fadeOut'],
            dismiss: {
              duration: 5000,
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
    let newselecteddownloads;

    if (event.target.checked) {
      newselecteddownloads = downloads.map(update => update.key);
    } else {
      newselecteddownloads = [];
    }

    setselecteddownloads(newselecteddownloads);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selecteddownloads.indexOf(id);
    let newselecteddownloads = [];

    if (selectedIndex === -1) {
      newselecteddownloads = newselecteddownloads.concat(selecteddownloads, id);
    } else if (selectedIndex === 0) {
      newselecteddownloads = newselecteddownloads.concat(
        selecteddownloads.slice(1)
      );
    } else if (selectedIndex === selecteddownloads.length - 1) {
      newselecteddownloads = newselecteddownloads.concat(
        selecteddownloads.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newselecteddownloads = newselecteddownloads.concat(
        selecteddownloads.slice(0, selectedIndex),
        selecteddownloads.slice(selectedIndex + 1)
      );
    }

    setselecteddownloads(newselecteddownloads);
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
  //   console.log(selecteddownloads);
  // }, [selecteddownloads])

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
                    checked={selecteddownloads.length === downloads.length}
                    color="primary"
                    indeterminate={
                      selecteddownloads.length > 0 &&
                      selecteddownloads.length < downloads.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>title</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Posted On</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {downloads
                .slice(page * limit, page * limit + limit)
                .map((download, i) => (
                  <TableRow
                    hover
                    key={download.key}
                    selected={selecteddownloads.indexOf(download.key) !== -1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selecteddownloads.indexOf(download.key) !== -1}
                        onChange={event => handleSelectOne(event, download.key)}
                        value="true"
                      />
                    </TableCell>
                    <TableCell>
                      <Box alignItems="center" display="flex">
                        <Typography color="textPrimary" variant="body1">
                          {download.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <a href={download.fileURL} target="blank">
                        Open File
                      </a>
                    </TableCell>
                    <TableCell>{download.year}</TableCell>
                    <TableCell>{download.dept}</TableCell>
                    <TableCell>
                      {convertTimestampToDate(download.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={downloads.length}
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
  className: PropTypes.string
};

export default Results;
