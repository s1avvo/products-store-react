import React, { useState } from "react";
import { Paper, useMediaQuery } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { ProductEntity } from "types";

interface Props {
  rows: ProductEntity[];
  columns: GridColDef[];
  postStatus: "idle" | "pending" | "succeeded" | "failed";
}

export const ProductsDataGrid = ({ rows, columns, postStatus }: Props) => {
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width:600px)");
  const [pageSize, setPageSize] = useState(10);

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
        components={{
          Toolbar: () => (
            <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
              {isNonMobileScreens && <GridToolbarFilterButton />}
              <GridToolbarQuickFilter />
            </GridToolbarContainer>
          ),
        }}
        loading={postStatus === "pending"}
        autoHeight={true}
        sx={{ padding: "10px" }}
        disableSelectionOnClick
        pagination
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[10, 25, 50]}
        onCellClick={(params) =>
          params.field !== "actions"
            ? navigate(`/details/${params.row.id}`)
            : null
        }
        initialState={{
          columns: {
            columnVisibilityModel: {
              place: isNonMobileScreens,
              secondName: isNonMobileScreens,
            },
          },
          sorting: {
            sortModel: [{ field: "name", sort: "asc" }],
          },
        }}
      />
    </Paper>
  );
};
