import React, { useState } from "react";
import { GoodsEntity } from "types";
import { TabPanel } from "./TabPanel";
import { ProductDetailsDataGrid } from "./ProductDetailsDataGrid";

import { Box, Tab, Tabs } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

interface Props {
  goodsIssue: GoodsEntity[];
  goodsReception: GoodsEntity[];
}

export const SupplyDetails = ({ goodsIssue, goodsReception }: Props) => {
  const [value, setValue] = useState("goods");

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Data",
      flex: 0.75,
      minWidth: 100,
      type: "date",
      valueGetter: ({ value }) => value && new Date(value).toLocaleDateString(),
    },
    { field: "amount", headerName: "Ilość", flex: 0.75, type: "number" },
    { field: "person", headerName: "Osoba", flex: 2 },
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
        {goodsIssue.length !== 0 && (
          <ProductDetailsDataGrid rows={goodsIssue} columns={columns} />
        )}
      </TabPanel>
      <TabPanel index={"orders"} value={value}>
        {goodsReception.length !== 0 && (
          <ProductDetailsDataGrid rows={goodsReception} columns={columns} />
        )}
      </TabPanel>
    </Box>
  );
};