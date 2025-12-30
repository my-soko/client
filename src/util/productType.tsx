export type ProductType = "INDIVIDUAL" | "SHOP";

export type ProductFormData = {
  title: string;
  description: string;
  price: string;
  discountPrice: string;
  stockInCount: string;
  category: string;
  brand: string;
  warranty: string;
  condition: string;
  status: string;
  quickSale: boolean;
  whatsappNumber: string;
  productType: "INDIVIDUAL" | "SHOP";
  shopAddress: string;
  latitude: number | null;
  longitude: number | null;
};