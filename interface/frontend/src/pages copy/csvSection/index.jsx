import React, {useState, useEffect} from 'react';

import Papa from 'papaparse';
import { useTable } from 'react-table';
import Web3 from 'web3';

const CsvSection = () => {
  const [csvarr, setCsvarr] = useState([]);
  const [uploadFile, setUploadFile] = useState(undefined);
  const [uploadFileExt, setUploadFileExt] = useState('');

  // upload file
  const handleChange = (event) => {
    const file = event.target.files[0]
    setUploadFile(file)
    const ext = file.name.split('.').pop();
    setUploadFileExt(ext);
  };
  // csv related
  const importCSV = () => {
    Papa.parse(uploadFile, {
      complete: updateData,
      header: true
    });
  };
  const renameKey = ( obj, oldKey, newKey ) => {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }
  const updateData = (result) => {
    var oldArrJson = result.data;

    oldArrJson.forEach( (obj) => renameKey( obj, 'block.number', 'blockNumber' ) );
    oldArrJson.forEach( (obj) => renameKey( obj, 'block.transactionCount', 'transactionCount' ) );
    const changedNameJson = oldArrJson;

    setCsvarr(changedNameJson);
    console.log(changedNameJson);
    console.log(csvarr);
  }
  const data = csvarr;
  const columns = React.useMemo(
    () => [
      {
        Header: 'blockNumber',
        accessor: 'blockNumber', // accessor is the "key" in the data
      },
      {
        Header: 'transactionCount',
        accessor: 'transactionCount',
      },
      {
        Header: 'totalCost',
        accessor: 'totalCost',
      },
    ],
    []
  )
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })

  // csv table
  const renderTable = () => (
    <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
      <thead>
      {headerGroups.map((headerGroup) => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => (
            <th
              {...column.getHeaderProps()}
              style={{
                  border: 'solid 1px black',
                  borderBottom: 'solid 3px black',
                  color: 'black',
                  fontWeight: 'bold',
              }}
            >
              {column.render('Header')}
            </th>
          ))}
        </tr>
      ))}
      </thead>
      <tbody {...getTableBodyProps()}>
      {rows.map((row) => {
        prepareRow(row)
        return (
          <tr {...row.getRowProps()}>
            {row.cells.map((cell) => {
              return (
                <td
                  {...cell.getCellProps()}
                  style={{
                      padding: '10px',
                      border: 'solid 1px black',
                  }}
                >
                  {cell.render('Cell')}
                </td>
              )
            })}
          </tr>
        )
      })}
    </tbody>
    </table>
  )

  return (
    <>
      <button onClick={importCSV}> Upload CSV only</button>  
      {csvarr&&renderTable()}
    </>
  )
}

export default CsvSection
