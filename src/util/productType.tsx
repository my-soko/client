
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