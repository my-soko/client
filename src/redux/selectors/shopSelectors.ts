import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Shop } from "../../types/Shops";

export const selectPinnedShops = (state: RootState): Shop[] => state.shop.allShops;

export const makeSelectShopsByProductCategory = () =>
  createSelector(
    [
      (state: RootState) => state.shop.allShops,
      (_: RootState, category?: string) => category,
    ],
    (shops, category): Shop[] => {
      // If no category, return ALL verified shops
      if (!category) return shops.filter(shop => shop.isVerified);

      // If category is selected, return shops with products in that category
      return shops.filter(
        shop =>
          shop.isVerified &&
          shop.products?.some(
            product => product.category?.toLowerCase() === category.toLowerCase()
          )
      );
    }
  );



