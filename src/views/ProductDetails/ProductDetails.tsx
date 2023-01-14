import React, { useEffect, useState } from "react";
import { ProductEntity, GoodsEntity, SupplyEntity } from "types";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { SupplyDetails } from "./SupplyDetails";

export const ProductDetails = () => {
  const { productId } = useParams();
  const [item, setItem] = useState<ProductEntity | null>(null);
  const [goods, setGoods] = useState<GoodsEntity[]>([]);
  const [supply, setSupply] = useState<SupplyEntity[]>([]);

  async function getItem() {
    const res = await fetch(`http://localhost:3001/${productId}`, {
      method: "GET",
    });
    const item = await res.json();
    setItem(item.product as ProductEntity);
    setGoods(item.goods as GoodsEntity[]);
    setSupply(item.supply as SupplyEntity[]);
  }

  useEffect(() => {
    getItem();
  }, [productId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box width="80%" m="80px auto">
      <Box display="flex" flexWrap="wrap" columnGap="40px">
        <Box flex="1 1 50%" mb="20px">
          <Box m="25px 0">
            <Typography variant="h4">
              {item?.name} - {item?.secondName}
            </Typography>
            <Typography sx={{ mt: "20px" }}>
              Ilość:{" "}
              <b>
                {item?.qty} {item?.unit}
              </b>
            </Typography>
            <Typography sx={{ mt: "20px" }}>
              Miejsce: <b>{item?.place}</b>
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* GOODS AND SUPPLY */}
      <Box>
        <SupplyDetails goods={goods} supply={supply} />
      </Box>
    </Box>
  );
};
