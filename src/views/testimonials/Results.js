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
  ListItemAvatar,
  Avatar
} from '@material-ui/core';
import firebase from "firebase";
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, testimonials, ...rest }) => {
  const classes = useStyles();
  const [selectedTestimonial, setSelectedTestimonial] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const deleteSelectedUpdate = async (e) => {
    selectedTestimonial.forEach((v,i) => {
        testimonials.forEach(async (val) => {
        if(val.key === v){
          const dataRef = firebase.database().ref('testimonials').child(v);
          const fileRef = firebase.storage().ref('testimonials').child(val.FileName)
          await fileRef.delete()
          await dataRef.remove()
        }
      })
    })
  }

  const handleSelectAll = (event) => {
    let newselectedTestimonial;

    if (event.target.checked) {
      newselectedTestimonial = testimonials.map((update) => update.key);
    } else {
      newselectedTestimonial = [];
    }

    setSelectedTestimonial(newselectedTestimonial);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedTestimonial.indexOf(id);
    let newselectedTestimonial = [];

    if (selectedIndex === -1) {
      newselectedTestimonial = newselectedTestimonial.concat(selectedTestimonial, id);
    } else if (selectedIndex === 0) {
      newselectedTestimonial = newselectedTestimonial.concat(selectedTestimonial.slice(1));
    } else if (selectedIndex === selectedTestimonial.length - 1) {
      newselectedTestimonial = newselectedTestimonial.concat(selectedTestimonial.slice(0, -1));
    } else if (selectedIndex > 0) {
      newselectedTestimonial = newselectedTestimonial.concat(
        selectedTestimonial.slice(0, selectedIndex),
        selectedTestimonial.slice(selectedIndex + 1)
      );
    }

    setSelectedTestimonial(newselectedTestimonial);
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

//   useEffect(() => {
//     console.log(selectedTestimonial);
//   }, [selectedTestimonial])


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
                    checked={selectedTestimonial.length === testimonials.length}
                    color="primary"
                    indeterminate={
                      selectedTestimonial.length > 0
                      && selectedTestimonial.length < testimonials.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Image
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Message
                </TableCell>
                <TableCell>
                  Work
                </TableCell>
                <TableCell>
                  Posted On
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testimonials.slice((page * limit), ((page * limit) + limit)).map((testimonial, i) => (
                <TableRow
                  hover
                  key={i}
                  selected={selectedTestimonial.indexOf(testimonial.key) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedTestimonial.indexOf(testimonial.key) !== -1}
                      onChange={(event) => handleSelectOne(event, testimonial.key)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >
                        <ListItemAvatar>
                            <Avatar alt={testimonial.name} src={testimonial.FileURL} />
                        </ListItemAvatar>
                    </Box>
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
                        {testimonial.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {testimonial.message}
                  </TableCell>
                  <TableCell>
                    {testimonial.work}
                  </TableCell>
                  <TableCell>
                    {convertTimestampToDate(testimonial.postedOn)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={testimonials.length}
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
