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
  border-radius: 14px;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    th {
      padding: 12px 18px;
      text-align: left;
      font-weight: 700;
      font-size: 12px;
      color: #111827;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
  }

  tbody {
    tr {
      &:hover {
        background: #f8fafc;
      }
    }

    td {
      padding: 14px 18px;
      font-size: 14px;
      color: #111827;
      text-align: left;
      border-bottom: 1px solid #eef2f7;
    }
  }
`;
