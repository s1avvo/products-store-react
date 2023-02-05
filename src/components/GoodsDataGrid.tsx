import React, { useState } from "react";
import { Paper } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { OrderViewEntity } from "types";

interface Props {
  rows: OrderViewEntity[];
  columns: GridColDef[];
}

export const GoodsDataGrid = ({ rows, columns }: Props) => {
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(25);

  return (
    <Paper
      sx={{
        margin: "0 auto",
        height: "auto",
        overflow: "auto",
        backgroundColor: "rgba(250, 250, 250, 0.95)",
        zIndex: "10",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row: OrderViewEntity) => row.idItem}
        components={{
          Toolbar: () => (
            <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
              <GridToolbarColumnsButton />
              <GridToolbarQuickFilter />
            </GridToolbarContainer>
          ),
        }}
        loading={!rows.length}
        sx={{ padding: "10px" }}
        disableSelectionOnClick
        autoHeight={true}
        pagination
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[10, 25, 50]}
        onCellClick={(params) =>
          params.field !== "actions"
            ? navigate(`/details/${params.row.id}`)
            : null
        }
      />
    </Paper>
  );
};
