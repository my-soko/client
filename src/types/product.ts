export interface ProductPayload {
  title: string;
  description: string;
  price: number;
  discountPrice: number | null;
  stockInCount: number;
  category: string;
  brand: string;
  warranty: string | null;
  condition: "BRAND_NEW" | "SLIGHTLY_USED" | "REFURBISHED";
  whatsappNumber: string;
  imageUrls: string[];
}