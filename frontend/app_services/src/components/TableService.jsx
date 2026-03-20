import React from "react";
import styled from "styled-components";

export const TableService = ({
  columns = [],
  data = [],
  observeIntersection = () => {},
}) => {
  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            {columns?.map(({ key, label }) => (
              <th key={key}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const isLast = index === data.length - 1;

            return (
              <tr key={row.id} ref={isLast ? observeIntersection : null}>
                {columns?.map(({ key, render }) => (
                  <td key={`${row.id}-${key}`}>
                    {render ? render(row) : row[key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </TableWrapper>
  );
};

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 16px;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #eef2ff;

    th {
      padding: 14px 20px;
      text-align: center;
      font-weight: 600;
      font-size: 14px;
      color: #4f46e5;
    }
  }

  tbody {
    tr {
      &:hover {
        background: #e5e9ec;
      }
    }
    tr:nth-child(even) {
      background: #f5f5f5;
      &:hover {
        background: #e5e9ec;
      }
    }

    td {
      padding: 14px 20px;
      font-size: 14px;
      color: #111827;
      text-align: center;
      border-bottom: 1px solid #e5e7eb;
    }
  }
`;
