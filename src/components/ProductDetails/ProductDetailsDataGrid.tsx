import React, { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { GoodsEntity } from "types";

interface Props {
  rows: GoodsEntity[];
  columns: GridColDef[];
  isLoading: boolean;
}

export const ProductDetailsDataGrid = ({ rows, columns, isLoading }: Props) => {
  const [pageSize, setPageSize] = useState(25);

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      getRowId={(row: GoodsEntity) => row.idItem as string}
      components={{
        Toolbar: () => (
          <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
            <GridToolbarColumnsButton />
            <GridToolbarQuickFilter />
          </GridToolbarContainer>
        ),
      }}
      loading={isLoading}
      autoHeight={true}
      sx={{ padding: "10px" }}
      disableSelectionOnClick
      pagination
      pageSize={pageSize}
      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
      rowsPerPageOptions={[10, 25, 50]}
      initialState={{
        sorting: { sortModel: [{ field: "date", sort: "desc" }] },
      }}
    />
  );
};
