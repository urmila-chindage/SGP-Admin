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

const NewsResults = ({ className, allNews, ...rest }) => {
  const classes = useStyles();
  const [selectedNews, setselectedNews] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);

  const deleteSelectedUpdate = async e => {
    selectedNews.forEach((v, i) => {
      allNews.forEach(async val => {
        if (val.key === v) {
          const dataRef = firebase
            .database()
            .ref('news')
            .child(v);
          const fileRef = firebase
            .storage()
            .ref('news')
            .child(val.FileName);
          await fileRef.delete();
          await dataRef.remove();
          store.addNotification({
            title: 'Successful!',
            message: 'News deleted',
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
    let newselectedNews;

    if (event.target.checked) {
      newselectedNews = allNews.map(update => update.key);
    } else {
      newselectedNews = [];
    }

    setselectedNews(newselectedNews);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedNews.indexOf(id);
    let newselectedNews = [];

    if (selectedIndex === -1) {
      newselectedNews = newselectedNews.concat(selectedNews, id);
    } else if (selectedIndex === 0) {
      newselectedNews = newselectedNews.concat(selectedNews.slice(1));
    } else if (selectedIndex === selectedNews.length - 1) {
      newselectedNews = newselectedNews.concat(selectedNews.slice(0, -1));
    } else if (selectedIndex > 0) {
      newselectedNews = newselectedNews.concat(
        selectedNews.slice(0, selectedIndex),
        selectedNews.slice(selectedIndex + 1)
      );
    }

    setselectedNews(newselectedNews);
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
                    checked={selectedNews.length === allNews.length}
                    color="primary"
                    indeterminate={
                      selectedNews.length > 0 &&
                      selectedNews.length < allNews.length
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
              {allNews
                .slice(page * limit, page * limit + limit)
                .map((news, i) => (
                  <TableRow
                    hover
                    key={i}
                    selected={selectedNews.indexOf(news.key) !== -1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedNews.indexOf(news.key) !== -1}
                        onChange={event => handleSelectOne(event, news.key)}
                        value="true"
                      />
                    </TableCell>
                    <TableCell>
                      <Box alignItems="center" display="flex">
                        <Typography color="textPrimary" variant="body1">
                          {news.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <a href={news.FileURL} target="blank">
                        Open File
                      </a>
                    </TableCell>
                    <TableCell>
                      {convertTimestampToDate(news.postedOn)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={allNews.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[1, 2, 3, 5, 10, 25]}
      />
    </Card>
  );
};

NewsResults.propTypes = {
  className: PropTypes.string,
  customers: PropTypes.array.isRequired
};

export default NewsResults;
