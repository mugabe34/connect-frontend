export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  location?: string;
  isActive?: boolean;
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
  approved: boolean;
  featured: boolean;
  likes?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  _id: string;
  from: string;
  to: string;
  content: string;
  createdAt: string;
  read?: boolean;
}





