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
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, publications, ...rest }) => {
  const classes = useStyles();
  const [selectedPublication, setSelectedPublication] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const deleteSelectedUpdate = async (e) => {
    selectedPublication.forEach((v,i) => {
        publications.forEach(async (val) => {
        if(val.key === v){
          const dataRef = firebase.database().ref('publications').child(val.department).child(v);
          await dataRef.remove()
        }
      })
    })
  }

  const handleSelectAll = (event) => {
    let newselectedPublication;

    if (event.target.checked) {
      newselectedPublication = publications.map((update) => update.key);
    } else {
      newselectedPublication = [];
    }

    setSelectedPublication(newselectedPublication);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedPublication.indexOf(id);
    let newselectedPublication = [];

    if (selectedIndex === -1) {
      newselectedPublication = newselectedPublication.concat(selectedPublication, id);
    } else if (selectedIndex === 0) {
      newselectedPublication = newselectedPublication.concat(selectedPublication.slice(1));
    } else if (selectedIndex === selectedPublication.length - 1) {
      newselectedPublication = newselectedPublication.concat(selectedPublication.slice(0, -1));
    } else if (selectedIndex > 0) {
      newselectedPublication = newselectedPublication.concat(
        selectedPublication.slice(0, selectedIndex),
        selectedPublication.slice(selectedIndex + 1)
      );
    }

    setSelectedPublication(newselectedPublication);
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
    console.log(selectedPublication);
  }, [selectedPublication])


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
                    checked={selectedPublication.length === publications.length}
                    color="primary"
                    indeterminate={
                      selectedPublication.length > 0
                      && selectedPublication.length < publications.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Title
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Published By
                </TableCell>
                <TableCell>
                  Category
                </TableCell>
                <TableCell>
                  Platform
                </TableCell>
                <TableCell>
                  Published in
                </TableCell>
                <TableCell>
                  Posted On
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {publications.slice((page * limit), ((page * limit) + limit)).map((publication, i) => (
                <TableRow
                  hover
                  key={i}
                  selected={selectedPublication.indexOf(publication.key) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedPublication.indexOf(publication.key) !== -1}
                      onChange={(event) => handleSelectOne(event, publication.key)}
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
                        {publication.title}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {publication.name}
                  </TableCell>
                  <TableCell>
                    {publication.publishedBy}
                  </TableCell>
                  <TableCell>
                    {publication.category}
                  </TableCell>
                  <TableCell>
                    {publication.platform}
                  </TableCell>
                  <TableCell>
                    {publication.year}
                  </TableCell>
                  <TableCell>
                    {convertTimestampToDate(publication.postedOn)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={publications.length}
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
