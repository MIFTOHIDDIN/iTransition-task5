import React, { useState, useRef, useLayoutEffect, useCallback, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';

import { RandomModule } from '../logicField/allRandom';

const generateItems = (amount, records) => {
  const arr = Array.from(Array(amount));
  return arr.map((number, i) => ({
    id: i+1,
    name: records[i+1].name,
    address: records[i+1].address,
    phone: records[i+1].phone,
    ranId: records[i+1].id
  }));
}

const TableWithInfiniteScroll = ({langProp, errProp, ranProp}) => {
  const tableEl = useRef();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [distanceBottom, setDistanceBottom] = useState(0);
  
  useEffect(() => {
    setRows(generateItems(20, (errProp != 0 ? RandomModule.getRecordsWithError(20, langProp, errProp, ranProp) : RandomModule.getRecordsWithoutError(20, langProp, ranProp))));
  }, []);

  useEffect(() => {
    setRows(generateItems(20, (errProp != 0 ? RandomModule.getRecordsWithError(20, langProp, errProp, ranProp) : RandomModule.getRecordsWithoutError(20, langProp, ranProp))));
  }, [langProp, ranProp, errProp]);

  const loadMore = useCallback(() => {
    const loadItems = async () => {
      await new Promise(resolve =>
        setTimeout(() => {
          const amount = rows.length + 10;
          setRows(generateItems(amount, (errProp != 0 ? RandomModule.getRecordsWithError(amount, langProp, errProp, ranProp) : RandomModule.getRecordsWithoutError(amount, langProp, ranProp))));
          setLoading(false);
          resolve();
        }, 2000)
      );
    }
    setLoading(true);
    loadItems()
  }, [rows]);

  const scrollListener = useCallback(() => {
    let bottom = tableEl.current.scrollHeight - tableEl.current.clientHeight;
    if (!distanceBottom) {
      setDistanceBottom(Math.round(bottom * 0.2))
    }
    if (tableEl.current.scrollTop > bottom - distanceBottom && !loading) {
      loadMore()
    }
  }, [loadMore, loading, distanceBottom]);

  useEffect(() => {
    const tableRef = tableEl.current
    tableRef.addEventListener('scroll', scrollListener)
    return () => {
      tableRef.removeEventListener('scroll', scrollListener)
    }
  }, [scrollListener]);

  return (
    <TableContainer style={{ width: '1000px', margin: 'auto', height: '400px' }} ref={tableEl}>
      {loading && <CircularProgress style={{ position: 'absolute', top: '100px' }} />}
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Random Identifier</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(({ id, name, address, phone, ranId }) => (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{address}</TableCell>
              <TableCell>{phone}</TableCell>
              <TableCell>{ranId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableWithInfiniteScroll;