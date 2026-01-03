import type { ProductFormData } from "../util/productType";

export interface Shop {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  businessType: string;
  registrationNo: string;
  taxPin?: string;
  isVerified: boolean;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email?: string;
  website?: string;
  documents: string[];
  createdAt: string;
  updatedAt: string;
  categories?: string[]; 
   products?: ProductFormData[];
}
