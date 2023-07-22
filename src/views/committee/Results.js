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

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, committees, ...rest }) => {
  const classes = useStyles();
  const [selectedCommittees, setselectedCommittees] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const deleteSelectedUpdate = async e => {
    selectedCommittees.forEach((v, i) => {
      committees.forEach(async val => {
        if (val.key === v) {
          const dataRef = firebase
            .database()
            .ref('committees')
            .child(v);
          await dataRef.remove();
        }
      });
    });
    // console.log(selectedCommittees)
  };

  const handleSelectAll = event => {
    let newselectedCommittees;

    if (event.target.checked) {
      newselectedCommittees = committees.map(update => update.key);
    } else {
      newselectedCommittees = [];
    }

    setselectedCommittees(newselectedCommittees);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCommittees.indexOf(id);
    let newselectedCommittees = [];

    if (selectedIndex === -1) {
      newselectedCommittees = newselectedCommittees.concat(
        selectedCommittees,
        id
      );
    } else if (selectedIndex === 0) {
      newselectedCommittees = newselectedCommittees.concat(
        selectedCommittees.slice(1)
      );
    } else if (selectedIndex === selectedCommittees.length - 1) {
      newselectedCommittees = newselectedCommittees.concat(
        selectedCommittees.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newselectedCommittees = newselectedCommittees.concat(
        selectedCommittees.slice(0, selectedIndex),
        selectedCommittees.slice(selectedIndex + 1)
      );
    }

    setselectedCommittees(newselectedCommittees);
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
  //   console.log(selectedCommittees);
  // }, [selectedCommittees])

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
        {committees.slice(page * limit, page * limit + limit).map((d, i) => (
          <Box>
            <Checkbox
              checked={selectedCommittees.indexOf(d.key) !== -1}
              onChange={event => handleSelectOne(event, d.key)}
              value="true"
            />
            <Typography color="textPrimary" variant="body1">
              {'Name: ' + d.committeeName + '  '}
              {'Year: ' + d.year}
            </Typography>

            <Box minWidth={1050}>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCommittees.length === committees.length}
                    color="primary"
                    indeterminate={
                      selectedCommittees.length > 0
                      && selectedCommittees.length < committees.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell> */}
                    <TableCell>Sr. No</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Designation</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {d.committeeMembers.map((committee, i) => (
                    <TableRow
                      hover
                      key={committee.key}
                      selected={
                        selectedCommittees.indexOf(committee.key) !== -1
                      }
                    >
                      {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCommittees.indexOf(committee.key) !== -1}
                      onChange={(event) => handleSelectOne(event, committee.key)}
                      value="true"
                    />
                  </TableCell> */}
                      <TableCell>
                        <Box alignItems="center" display="flex">
                          <Typography color="textPrimary" variant="body1">
                            {i + 1}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{committee.name}</TableCell>
                      <TableCell>{committee.designation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        ))}
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={committees.length}
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
