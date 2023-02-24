import React, { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { GoodsEntity } from "types";
import { useMediaQuery } from "@mui/material";

interface Props {
  rows: GoodsEntity[];
  columns: GridColDef[];
  isLoading: boolean;
}

export const ProductDetailsDataGrid = ({ rows, columns, isLoading }: Props) => {
  const isNonMobileScreens = useMediaQuery("(min-width:800px)");
  const [pageSize, setPageSize] = useState(10);

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      getRowId={(row: GoodsEntity) => row.idItem as string}
      components={{
        Toolbar: () => (
          <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
            {isNonMobileScreens && <GridToolbarFilterButton />}
            <GridToolbarQuickFilter />
          </GridToolbarContainer>
        ),
      }}
      loading={isLoading}
      autoHeight={true}
      sx={{ padding: "10px", border: "none" }}
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
