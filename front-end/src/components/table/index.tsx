/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Box,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
export interface Column<T> {
  id: keyof T;
  label: string;
  align?: "left" | "right" | "center";
  format?: (value: any, row: T) => React.ReactNode;
}

interface SimpleTableProps<T> {
  rows: T[];
  columns: Column<T>[];
}

export default function SimpleTable<T extends Record<string, any>>({
  rows,
  columns,
}: SimpleTableProps<T>) {
  const theme = useTheme();
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = React.useState<keyof T | "">("");
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);

  const handleSort = (columnId: keyof T) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
  };

  const sortedRows = React.useMemo(() => {
    if (!orderBy) return rows;

    return [...rows].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (order === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
      }
    });
  }, [rows, order, orderBy]);

  const paginatedRows = React.useMemo(() => {
    return sortedRows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [sortedRows, page, rowsPerPage]);

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer
        sx={{
          maxHeight: 520,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Table stickyHeader sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={String(col.id)}
                  align={col.align || "left"}
                  sx={{
                    fontWeight: 700,
                    backgroundColor: alpha(
                      theme.palette.background.paper,
                      0.95,
                    ),
                    backdropFilter: "blur(6px)",
                    borderBottom: `2px solid ${theme.palette.divider}`,
                  }}
                >
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : "asc"}
                    onClick={() => handleSort(col.id)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  hover
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    transition: "background-color 0.15s ease",
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={String(col.id)}
                      align={col.align || "left"}
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {col.format
                        ? col.format(row[col.id], row)
                        : String(row[col.id] ?? "—")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 6 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No data available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        sx={{
          mt: 1,
          borderTop: "none",
          color: theme.palette.text.secondary,
        }}
      />
    </Box>
  );
}
