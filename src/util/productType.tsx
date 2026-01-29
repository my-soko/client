
export type ProductType = "INDIVIDUAL" | "SHOP";

export type ProductFormData = {
  id?: string;
  title: string;
  description: string;
  price: string;
  discountPrice: string;
  stockInCount: string;
  category: string;
  brand: string;
  subItem?: string | null;
  warranty: string;
  condition: string;
  status: string;
  quickSale: boolean;
  whatsappNumber: string;
  productType: "INDIVIDUAL" | "SHOP";
  shopId?: string;
};



export interface ProductColor {
  name: string;
  hex: string;
  isCustom?: boolean;
}


export const AVAILABLE_COLORS: ProductColor[] = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Gray", hex: "#808080" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Gold", hex: "#FFD700" },

  { name: "Red", hex: "#FF0000" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Green", hex: "#008000" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Purple", hex: "#800080" },

  { name: "Pink", hex: "#FFC0CB" },
  { name: "Brown", hex: "#8B4513" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Cream", hex: "#FFFDD0" },

  { name: "Navy Blue", hex: "#000080" },
  { name: "Teal", hex: "#008080" },
  { name: "Maroon", hex: "#800000" },
  { name: "Olive", hex: "#808000" },
];

