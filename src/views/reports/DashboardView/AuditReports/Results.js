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

const Results = ({ className, items, ...rest }) => {
  const classes = useStyles();
  const [selectedItems, setSelectedItems] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const deleteSelectedUpdate = async e => {
    selectedItems.forEach((v, i) => {
      items.forEach(async val => {
        if (val.key === v) {
          const dataRef = firebase
            .database()
            .ref('auditReports')
            .child(v);
          const fileRef = firebase
            .storage()
            .ref('auditReports')
            .child(val.FileName);
          await fileRef.delete();
          await dataRef.remove();
          store.addNotification({
            title: 'Successful!',
            message: 'Audit Deleted successfully',
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
    let newselectedItems;

    if (event.target.checked) {
      newselectedItems = items.map(update => update.key);
    } else {
      newselectedItems = [];
    }

    setSelectedItems(newselectedItems);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedItems.indexOf(id);
    let newselectedItems = [];

    if (selectedIndex === -1) {
      newselectedItems = newselectedItems.concat(selectedItems, id);
    } else if (selectedIndex === 0) {
      newselectedItems = newselectedItems.concat(selectedItems.slice(1));
    } else if (selectedIndex === selectedItems.length - 1) {
      newselectedItems = newselectedItems.concat(selectedItems.slice(0, -1));
    } else if (selectedIndex > 0) {
      newselectedItems = newselectedItems.concat(
        selectedItems.slice(0, selectedIndex),
        selectedItems.slice(selectedIndex + 1)
      );
    }

    setSelectedItems(newselectedItems);
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
  //   console.log(selectedItems);
  // }, [selectedItems])

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
                    checked={selectedItems.length === items.length}
                    color="primary"
                    indeterminate={
                      selectedItems.length > 0 &&
                      selectedItems.length < items.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>title</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Posted On</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items
                .slice(page * limit, page * limit + limit)
                .map((download, i) => (
                  <TableRow
                    hover
                    key={download.key}
                    selected={selectedItems.indexOf(download.key) !== -1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedItems.indexOf(download.key) !== -1}
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
        count={items.length}
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
