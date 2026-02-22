export type Category = 'Hot' | 'Ice' | 'Tea' | 'Frappe' | 'Smoothie';

export interface Drink {
  id: string;
  nameEn: string;
  nameKh: string;
  price: number;
  category: Category;
  image: string;
  isBestSeller: boolean;
  isOutOfStock: boolean;
  isHidden: boolean;
}

export type Language = 'en' | 'kh';

export interface CafeInfo {
  name: string;
  logo: string;
  url: string; /* Used for QR Code */
  locationEn?: string;
  locationKh?: string;
  phone?: string;
  email?: string;
  hoursEn?: string;
  hoursKh?: string;
}
