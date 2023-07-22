import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
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
import getInitials from 'src/utils/getInitials';
import firebase from "firebase";
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, updates, ...rest }) => {
  const classes = useStyles();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const deleteSelectedUpdate = async (e) => {
    selectedCustomerIds.forEach((v,i) => {
      updates.forEach(async (val) => {
        if(val.key === v){
          const dataRef = firebase.database().ref('updates').child(v)
          const imgRef = firebase.storage().ref('images').child(val.imgname)
          const fileRef = firebase.storage().ref('files').child(val.pdfname)
          await imgRef.delete()
          await fileRef.delete()
          await dataRef.remove()
        }
      })
    })
  }

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = updates.map((update) => update.key);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const convertTimestampToDate = (tmstp) => {
    let d = new Date(tmstp);
    let date = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear()
    return date;
  }

  useEffect(() => {
    console.log(selectedCustomerIds);
  }, [selectedCustomerIds])


  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
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
                    checked={selectedCustomerIds.length === updates.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0
                      && selectedCustomerIds.length < updates.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Title
                </TableCell>
                <TableCell>
                  Description
                </TableCell>
                <TableCell>
                  File
                </TableCell>
                <TableCell>
                  Uploaded on
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {updates.slice(0, limit).map((update, i) => (
                <TableRow
                  hover
                  key={update.key}
                  selected={selectedCustomerIds.indexOf(update.key) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(update.key) !== -1}
                      onChange={(event) => handleSelectOne(event, update.key)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >
                      <a href={update.imageDownloadUrl} target="blank">
                      <Avatar
                        className={classes.avatar}
                        src={update.imageDownloadUrl}
                      >
                        {getInitials(update.title)}
                      </Avatar>
                      </a>
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {update.title}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {update.description}
                  </TableCell>
                  <TableCell>
                    <a href={update.fileDownloadUrl} target="blank">Open File</a>
                  </TableCell>
                  <TableCell>
                    {convertTimestampToDate(update.postedOn)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={updates.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  customers: PropTypes.array.isRequired
};

export default Results;
