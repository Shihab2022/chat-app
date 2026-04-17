import { Box, TablePagination } from "@mui/material";
const PaginationButtons = (props: any) => {
  const { count, page, setPage, pageSize = 10, setPageSize } = props;
  const handleChangeRowsPerPage = (event: any) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <Box sx={{ width: "100%", paddingRight: "50px" }}>
      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={(e, value) => setPage(value)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default PaginationButtons;
