import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { GoodsEntity, SupplyEntity, SupplyItem } from "types";
import { TabPanel } from "./TabPanel";
import {
  DataGrid,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

interface Props {
  goods: GoodsEntity[];
  supply: SupplyEntity[];
}

export const SupplyDetails = (props: Props) => {
  const [value, setValue] = useState("goods");

  const columns: GridColDef[] = [
    {
      field: "data",
      headerName: "Data",
      flex: 0.75,
      minWidth: 100,
      type: "date",
      valueGetter: ({ value }) => value && new Date(value).toLocaleDateString(),
    },
    { field: "amount", headerName: "Ilość", flex: 0.75, type: "number" },
    { field: "person", headerName: "Osoba", flex: 2 },
    { field: "status", headerName: "Status", flex: 0.75 },
  ];

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="product-details-tabs"
        >
          <Tab label="WYDANIA" value="goods" />
          <Tab label="ZAMÓWIENIA" value="orders" />
        </Tabs>
      </Box>
      <TabPanel index="goods" value={value}>
        <div style={{ height: "75vh", width: "100%" }}>
          <DataGrid
            rows={props.goods}
            columns={columns}
            components={{
              Toolbar: () => (
                <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
                  <GridToolbarColumnsButton />
                  <GridToolbarQuickFilter />
                </GridToolbarContainer>
              ),
            }}
            loading={!props.goods.length}
            sx={{ padding: "10px" }}
            disableSelectionOnClick
            autoPageSize={true}
            pagination
            initialState={{
              sorting: { sortModel: [{ field: "data", sort: "asc" }] },
            }}
          />
        </div>
      </TabPanel>
      <TabPanel index={"orders"} value={value}>
        <div style={{ height: "75vh", width: "100%" }}>
          <DataGrid
            rows={props.supply}
            columns={columns}
            loading={!props.supply.length}
            sx={{ padding: "10px" }}
            components={{
              Toolbar: () => (
                <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
                  <GridToolbarColumnsButton />
                  <GridToolbarQuickFilter />
                </GridToolbarContainer>
              ),
            }}
            disableSelectionOnClick
            autoPageSize={true}
            pagination
            initialState={{
              sorting: { sortModel: [{ field: "data", sort: "asc" }] },
            }}
          />
        </div>
      </TabPanel>
    </Box>
  );
};
