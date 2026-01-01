export interface ProductPayload {
  title: string;
  description: string;
  price: number;
  discountPrice: number | null;
  stockInCount: number;
  category: string;
  brand: string;
  subItem?: string | null;
  warranty: string | null;
  condition: "BRAND_NEW" | "SLIGHTLY_USED" | "REFURBISHED";
  whatsappNumber: string;
  imageUrls: string[];
  productType: "INDIVIDUAL" | "SHOP";
  shopName: string;
  shopAddress: string;
  latitude: number | null;
  longitude: number | null;
}