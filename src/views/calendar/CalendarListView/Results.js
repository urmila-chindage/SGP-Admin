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
import firebase from "firebase";

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, calendars, ...rest }) => {
  const classes = useStyles();
  const [selectedCalendars, setselectedCalendars] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const deleteSelectedUpdate = async (e) => {
    selectedCalendars.forEach((v,i) => {
        calendars.forEach(async (val) => {
        if(val.key === v){
          const dataRef = firebase.database().ref('academic-calendar').child(val.department).child(v);
          const fileRef = firebase.storage().ref('calendars').child(val.FileName)
          await fileRef.delete()
          await dataRef.remove()
        }
      })
    })
  }

  const handleSelectAll = (event) => {
    let newselectedCalendars;

    if (event.target.checked) {
      newselectedCalendars = calendars.map((update) => update.key);
    } else {
      newselectedCalendars = [];
    }

    setselectedCalendars(newselectedCalendars);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCalendars.indexOf(id);
    let newselectedCalendars = [];

    if (selectedIndex === -1) {
      newselectedCalendars = newselectedCalendars.concat(selectedCalendars, id);
    } else if (selectedIndex === 0) {
      newselectedCalendars = newselectedCalendars.concat(selectedCalendars.slice(1));
    } else if (selectedIndex === selectedCalendars.length - 1) {
      newselectedCalendars = newselectedCalendars.concat(selectedCalendars.slice(0, -1));
    } else if (selectedIndex > 0) {
      newselectedCalendars = newselectedCalendars.concat(
        selectedCalendars.slice(0, selectedIndex),
        selectedCalendars.slice(selectedIndex + 1)
      );
    }

    setselectedCalendars(newselectedCalendars);
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

  // useEffect(() => {
  //   console.log(selectedCalendars);
  // }, [selectedCalendars])


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
                    checked={selectedCalendars.length === calendars.length}
                    color="primary"
                    indeterminate={
                      selectedCalendars.length > 0
                      && selectedCalendars.length < calendars.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Year
                </TableCell>
                <TableCell>
                  Level
                </TableCell>
                <TableCell>
                  File
                </TableCell>
                <TableCell>
                  Department
                </TableCell>
                <TableCell>
                  Posted On
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {calendars.slice((page * limit), ((page * limit) + limit)).map((calendar, i) => (
                <TableRow
                  hover
                  key={calendar.key}
                  selected={selectedCalendars.indexOf(calendar.key) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCalendars.indexOf(calendar.key) !== -1}
                      onChange={(event) => handleSelectOne(event, calendar.key)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {calendar.year}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {calendar.level}
                  </TableCell>
                  <TableCell>
                    <a href={calendar.fileDownloadURL} target="blank">Open File</a>
                  </TableCell>
                  <TableCell>
                    {calendar.department}
                  </TableCell>
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
        count={calendars.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[1,2,3, 5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  customers: PropTypes.array.isRequired
};

export default Results;
