import React, { useState } from "react";
import { GoodsEntity } from "types";
import { TabPanel } from "./TabPanel";
import { ProductDetailsDataGrid } from "./ProductDetailsDataGrid";

import { Box, Tab, Tabs, useMediaQuery } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

interface Props {
  goodsIssue: GoodsEntity[];
  goodsReception: GoodsEntity[];
  isLoading: boolean;
}

export const SupplyDetails = ({
  goodsIssue,
  goodsReception,
  isLoading,
}: Props) => {
  const isNonMobileScreens = useMediaQuery("(min-width:600px)");
  const [value, setValue] = useState("goods");

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Data",
      flex: 1,
      minWidth: 100,
      type: "date",
      valueGetter: ({ value }) =>
        isNonMobileScreens
          ? value && value.slice(0, -5).replace("T", " ")
          : value && value.slice(0, -14),
    },
    { field: "amount", headerName: "Ilość", flex: 0.75, type: "number" },
    { field: "person", headerName: "Osoba", flex: 1.5 },
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
        <ProductDetailsDataGrid
          rows={goodsIssue}
          columns={columns}
          isLoading={isLoading}
        />
      </TabPanel>
      <TabPanel index={"orders"} value={value}>
        <ProductDetailsDataGrid
          rows={goodsReception}
          columns={columns}
          isLoading={isLoading}
        />
      </TabPanel>
    </Box>
  );
};
