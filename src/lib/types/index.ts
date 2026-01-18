// Role Enum
export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

// User Status Enum
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

// Blog Status Enum
export enum BlogStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  PENDING_REVIEW = 'PENDING_REVIEW',
}

// Image Types
export interface Image {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
  isFeaturedImage?: boolean;
  createdAt: string;
  updatedAt: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  status?: UserStatus | string;
  deletedAt?: string | null;
  blogs?: Blog[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: Role;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
  isActive?: boolean;
  status?: UserStatus | string;
}

// Blog Types
export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  isPublished: boolean;
  status?: BlogStatus | string;
  deletedAt?: string | null;
  author?: User;
  authorId: string;
  images?: Image[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogDto {
  title: string;
  content: string;
  excerpt?: string;
  status?: BlogStatus | string;
}

export interface UpdateBlogDto {
  title?: string;
  content?: string;
  excerpt?: string;
  status?: BlogStatus | string;
}

// Auth Types
export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: Role;
}

export interface AuthResponse {
  success: boolean;
  data: {
    access_token: string;
    user: User;
  };
  timestamp: string;
}

// Email Types
export interface SendEmailDto {
  to: string[];
  subject: string;
  text: string;
  html?: string;
  cc?: string[];
  bcc?: string[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  timestamp: string;
}
