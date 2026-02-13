export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  isActive?: boolean;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: { url: string; publicId: string }[];
  category?: string;
  tags?: string[];
  seller: User;
  contact: { email: string; phone?: string };
   location?: string;
  approved: boolean;
  featured: boolean;
  likes?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  subject?: string;
  body: string;
  sender?: { id: string; name: string; email: string; role?: UserRole };
  recipient?: string;
  createdAt: string;
  read?: boolean;
  fromAdmin?: boolean;
}

