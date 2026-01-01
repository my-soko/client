import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Shop } from "../../types/shop";

export const selectShopsFromProducts = createSelector(
  [(state: RootState) => state.product.products],
  (products): Shop[] => {
    const shopMap = new Map<string, Shop>();

    products.forEach((p) => {
      if (
        p.productType !== "SHOP" ||
        !p.latitude ||
        !p.longitude ||
        !p.shopName
      )
        return;

      if (!shopMap.has(p.shopName)) {
        shopMap.set(p.shopName, {
          shopName: p.shopName,
          shopAddress: p.shopAddress,
          latitude: p.latitude,
          longitude: p.longitude,
          categories: [p.category],
          productsCount: 1,
          totalStock: p.stockInCount, 
        });
      } else {
        const shop = shopMap.get(p.shopName)!;
        shop.productsCount += 1;
        shop.totalStock += p.stockInCount; // sum stock
        if (!shop.categories.includes(p.category)) {
          shop.categories.push(p.category);
        }
      }
    });

    return Array.from(shopMap.values());
  }
);

