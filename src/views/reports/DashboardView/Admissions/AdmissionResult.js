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
  Button,
  Chip
} from '@material-ui/core';
import firebase from 'firebase';
import { store } from 'react-notifications-component';

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const AdmissionResult = ({
  className,
  admissions,
  isResponded = false,
  ...rest
}) => {
  const classes = useStyles();
  const [selectedadmissions, setselectedadmissions] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const deleteSelectedUpdate = async e => {
    selectedadmissions.forEach((v, i) => {
      admissions.forEach(async val => {
        if (val.key === v) {
          const deleteDataRef = firebase
            .database()
            .ref('admission-req')
            .child('notResponded')
            .child(v);

          let obj = {
            fullName: val.fullName,
            email: val.email,
            phone: val.phone,
            address: val.address,
            interestedBranches: val.interestedBranches,
            caste: val.caste,
            SSCMarks: val.SSCMarks,
            hscMarks: val.hscMarks,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          };

          const newLocationRef = firebase
            .database()
            .ref('admission-req')
            .child('Responded');
          newLocationRef.push(obj, async err => {
            if (!err) {
              await deleteDataRef.remove();
              store.addNotification({
                title: 'Successful!',
                message: 'admission moved to Responded',
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
        }
      });
    });
  };

  const handleSelectAll = event => {
    let newselectedadmissions;

    if (event.target.checked) {
      newselectedadmissions = admissions.map(update => update.key);
    } else {
      newselectedadmissions = [];
    }

    setselectedadmissions(newselectedadmissions);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedadmissions.indexOf(id);
    let newselectedadmissions = [];

    if (selectedIndex === -1) {
      newselectedadmissions = newselectedadmissions.concat(
        selectedadmissions,
        id
      );
    } else if (selectedIndex === 0) {
      newselectedadmissions = newselectedadmissions.concat(
        selectedadmissions.slice(1)
      );
    } else if (selectedIndex === selectedadmissions.length - 1) {
      newselectedadmissions = newselectedadmissions.concat(
        selectedadmissions.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newselectedadmissions = newselectedadmissions.concat(
        selectedadmissions.slice(0, selectedIndex),
        selectedadmissions.slice(selectedIndex + 1)
      );
    }

    setselectedadmissions(newselectedadmissions);
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
  //   console.log(selectedadmissions);
  // }, [selectedadmissions])

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
      style={{ marginTop: '10px', marginRight: '6px', marginLeft: '6px' }}
    >
      {!isResponded && (
        <Button
          color="secondary"
          variant="contained"
          onClick={deleteSelectedUpdate}
        >
          Move To Responded
        </Button>
      )}

      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                {!isResponded && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedadmissions.length === admissions.length}
                      color="primary"
                      indeterminate={
                        selectedadmissions.length > 0 &&
                        selectedadmissions.length < admissions.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                )}
                <TableCell>full Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Interested Branches</TableCell>
                <TableCell>SSC Marks</TableCell>
                <TableCell>HSC Marks</TableCell>
                <TableCell>Caste</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admissions
                .slice(page * limit, page * limit + limit)
                .map((admission, i) => (
                  <TableRow
                    hover
                    key={admission.key}
                    selected={selectedadmissions.indexOf(admission.key) !== -1}
                  >
                    {!isResponded && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={
                            selectedadmissions.indexOf(admission.key) !== -1
                          }
                          onChange={event =>
                            handleSelectOne(event, admission.key)
                          }
                          value="true"
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <Box alignItems="center" display="flex">
                        <Typography color="textPrimary" variant="body1">
                          {admission.fullName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{admission.phone}</TableCell>
                    <TableCell>{admission.email}</TableCell>
                    <TableCell>{admission.address}</TableCell>
                    <TableCell>
                      {admission.interestedBranches.map((d, i) => (
                        <Chip label={d} color="primary" key={i} />
                      ))}
                    </TableCell>
                    <TableCell>
                      {admission.SSCMarks ? admission.SSCMarks : '-'}
                    </TableCell>
                    <TableCell>
                      {admission.hscMarks ? admission.hscMarks : '-'}
                    </TableCell>
                    <TableCell>{admission.caste}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={admissions.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[1, 2, 3, 5, 10, 25]}
      />
    </Card>
  );
};

AdmissionResult.propTypes = {
  className: PropTypes.string
};

export default AdmissionResult;
