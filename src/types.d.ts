export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  role: UserRole;
  verified?: boolean;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category?: string;
  location?: string;
  featured?: boolean;
  hotDeal?: boolean;
  seller: Pick<User, '_id' | 'name' | 'email' | 'phone' | 'whatsapp' | 'verified'>;
  views?: number;
  favoritesCount?: number;
}

export interface Message {
  _id: string;
  from: string;
  to: string;
  content: string;
  createdAt: string;
  read?: boolean;
}





