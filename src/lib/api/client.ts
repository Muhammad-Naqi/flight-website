import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  ApiResponse,
  PaginatedResponse,
  User,
  CreateUserDto,
  UpdateUserDto,
  Blog,
  CreateBlogDto,
  UpdateBlogDto,
  LoginDto,
  SignupDto,
  AuthResponse,
  SendEmailDto,
} from '../types';
import { BlogStatus } from '../types';

// Normalize API URL to use IPv4 (127.0.0.1) instead of localhost to avoid IPv6 issues
const getApiBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  // Replace localhost with 127.0.0.1 to force IPv4 (avoids ::1 IPv6 issues)
  if (url.includes('localhost') && !url.includes('127.0.0.1')) {
    return url.replace('localhost', '127.0.0.1');
  }
  return url;
};

const API_BASE_URL = getApiBaseUrl();

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Don't automatically redirect on 401 errors
        // Let components handle errors and display appropriate messages
        // Components can decide whether to redirect based on their context

        // Only clear token if it's explicitly an authentication failure
        // and the component hasn't handled it
        if (error.response?.status === 401 && typeof window !== 'undefined') {
          const errorUrl = error.config?.url || '';
          const errorData = error.response?.data as any;
          const errorMessage = (
            errorData?.message ||
            errorData?.error ||
            errorData?.data?.message ||
            ''
          ).toLowerCase();

          // Check if it's a business logic error (should NOT clear token or redirect)
          const isBusinessEndpoint =
            errorUrl.includes('/email') ||
            errorUrl.includes('/contact') ||
            errorUrl.includes('/blogs') ||
            (errorUrl.includes('/users') && !errorUrl.includes('/auth/'));

          const isBusinessError =
            errorMessage.includes('address') ||
            errorMessage.includes('inactive') ||
            errorMessage.includes('email') ||
            errorMessage.includes('service') ||
            errorMessage.includes('configuration');

          // Only clear token for actual authentication failures on auth endpoints
          // Don't clear token or redirect for business logic errors
          if (!isBusinessEndpoint && !isBusinessError) {
            const isAuthEndpoint =
              errorUrl.includes('/auth/') ||
              errorUrl.includes('/login') ||
              errorUrl.includes('/signup');

            // Only clear token if it's an auth endpoint failure
            // Still don't redirect - let the component handle it
            if (isAuthEndpoint) {
              localStorage.removeItem('auth_token');
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth Methods
  async login(credentials: LoginDto): Promise<AuthResponse> {
    try {
      const response = await this.client.post<any>('/auth/login', credentials);

      // Handle different possible response structures
      // The API might return nested structures like:
      // { success, data: { success, data: { access_token, user } } }
      // or { success, data: { access_token, user } }
      // or { access_token, user }
      const responseData = response.data;
      let authData: any = null;
      let token: string | null = null;
      let user: any = null;

      // Try to extract token from various nested structures
      // Check for triple-nested: response.data.data.data.access_token (your API structure)
      if (responseData?.data?.data?.data?.access_token) {
        token = responseData.data.data.data.access_token;
        authData = responseData.data.data.data;
        // User is at responseData.data.data.data.user
        user = responseData.data.data.data.user || authData.user;
      }
      // Check for double-nested: response.data.data.access_token
      else if (responseData?.data?.data?.access_token) {
        token = responseData.data.data.access_token;
        authData = responseData.data.data;
        user = responseData.data.data.user || authData.user;
      }
      // Check for single-nested: response.data.access_token
      else if (responseData?.data?.access_token) {
        token = responseData.data.access_token;
        authData = responseData.data;
        user = authData.user;
      }
      // Check for direct: response.access_token
      else if (responseData?.access_token) {
        token = responseData.access_token;
        authData = responseData;
        user = authData.user;
      }
      // Check for token field instead of access_token
      else if (responseData?.data?.data?.data?.token) {
        token = responseData.data.data.data.token;
        authData = responseData.data.data.data;
        user = authData.user;
      } else if (responseData?.data?.data?.token) {
        token = responseData.data.data.token;
        authData = responseData.data.data;
        user = authData.user;
      } else if (responseData?.data?.token) {
        token = responseData.data.token;
        authData = responseData.data;
        user = authData.user;
      } else if (responseData?.token) {
        token = responseData.token;
        authData = responseData;
        user = authData.user;
      }

      if (!token) {
        console.error(
          'No token found in response. Response structure:',
          JSON.stringify(responseData, null, 2)
        );
        throw new Error('Authentication failed: No token received from server');
      }

      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
      }

      // Return the full response structure
      return {
        success: responseData.success !== false, // Default to true if not explicitly false
        data: {
          access_token: token,
          user: user || authData?.user || null,
        },
        timestamp:
          responseData.timestamp || responseData.data?.timestamp || new Date().toISOString(),
      } as AuthResponse;
    } catch (error: any) {
      // Clear any existing token on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      throw error;
    }
  }

  async signup(data: SignupDto): Promise<ApiResponse<AuthResponse['data']>> {
    const response = await this.client.post<ApiResponse<AuthResponse['data']>>(
      '/auth/signup',
      data
    );
    return response.data;
  }

  async authenticatedSignup(data: SignupDto): Promise<ApiResponse<AuthResponse['data']>> {
    const response = await this.client.post<ApiResponse<AuthResponse['data']>>(
      '/auth/signup/authenticated',
      data
    );
    return response.data;
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  // User Methods
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await this.client.get<any>('/users/me');

    // Handle nested API response structures
    // The API might return: { success, data: { success, data: { user } } } or { success, data: { user } }
    const responseData = response.data;
    let userData: User | null = null;

    // Try to extract user from various nested structures
    if (responseData?.data?.data?.id) {
      // Triple-nested: response.data.data.data
      userData = responseData.data.data as User;
    } else if (responseData?.data?.id) {
      // Double-nested: response.data.data
      userData = responseData.data as User;
    } else if (responseData?.id) {
      // Direct: response.data
      userData = responseData as User;
    }

    if (!userData) {
      console.error('Could not extract user data from response:', responseData);
      throw new Error('Failed to extract user data from API response');
    }

    return {
      success: responseData.success !== false,
      data: userData,
      timestamp: responseData.timestamp || new Date().toISOString(),
    } as ApiResponse<User>;
  }

  async getUsers(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    const response = await this.client.get<any>('/users', {
      params: { page, limit },
    });

    // Handle nested API response structures
    const responseData = response.data;
    let paginatedData: PaginatedResponse<User> | null = null;

    // Try to extract paginated data from various nested structures
    if (responseData?.data?.data && Array.isArray(responseData.data.data)) {
      // Triple-nested: response.data.data.data (array) and response.data.data.meta
      paginatedData = {
        success: responseData.success !== false,
        data: responseData.data.data,
        meta: responseData.data.meta ||
          responseData.data.data.meta || {
            page,
            limit,
            total: responseData.data.data.length,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        timestamp: responseData.timestamp || new Date().toISOString(),
      };
    } else if (responseData?.data && Array.isArray(responseData.data)) {
      // Double-nested: response.data (array) and response.meta
      paginatedData = {
        success: responseData.success !== false,
        data: responseData.data,
        meta: responseData.meta || {
          page,
          limit,
          total: responseData.data.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        timestamp: responseData.timestamp || new Date().toISOString(),
      };
    } else if (Array.isArray(responseData)) {
      // Direct array response
      paginatedData = {
        success: true,
        data: responseData,
        meta: {
          page,
          limit,
          total: responseData.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        timestamp: new Date().toISOString(),
      };
    } else {
      // Try to use responseData directly if it has the PaginatedResponse structure
      paginatedData = responseData as PaginatedResponse<User>;
    }

    if (!paginatedData || !paginatedData.data) {
      console.error('Could not extract paginated data from response:', responseData);
      // Return empty paginated response instead of throwing
      return {
        success: false,
        data: [],
        meta: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        timestamp: new Date().toISOString(),
      };
    }

    return paginatedData;
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    const response = await this.client.get<any>(`/users/${id}`);

    // Handle nested API response structures
    const responseData = response.data;
    let userData: User | null = null;

    // Try to extract user from various nested structures
    if (responseData?.data?.data?.id) {
      // Triple-nested: response.data.data.data
      userData = responseData.data.data as User;
    } else if (responseData?.data?.id) {
      // Double-nested: response.data.data
      userData = responseData.data as User;
    } else if (responseData?.id) {
      // Direct: response.data
      userData = responseData as User;
    }

    if (!userData) {
      console.error('Could not extract user data from response:', responseData);
      throw new Error('Failed to extract user data from API response');
    }

    return {
      success: responseData.success !== false,
      data: userData,
      timestamp: responseData.timestamp || new Date().toISOString(),
    } as ApiResponse<User>;
  }

  async createUser(data: CreateUserDto): Promise<ApiResponse<User>> {
    const response = await this.client.post<ApiResponse<User>>('/users', data);
    return response.data;
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<ApiResponse<User>> {
    const response = await this.client.patch<any>(`/users/${id}`, data);

    // Handle nested API response structures
    const responseData = response.data;
    let userData: User | null = null;

    // Try to extract user from various nested structures
    if (responseData?.data?.data?.id) {
      userData = responseData.data.data as User;
    } else if (responseData?.data?.id) {
      userData = responseData.data as User;
    } else if (responseData?.id) {
      userData = responseData as User;
    }

    if (!userData) {
      console.error('Could not extract user data from response:', responseData);
      throw new Error('Failed to extract user data from API response');
    }

    return {
      success: responseData.success !== false,
      data: userData,
      timestamp: responseData.timestamp || new Date().toISOString(),
    } as ApiResponse<User>;
  }

  async updateUserStatus(id: string, status: string): Promise<ApiResponse<User>> {
    const response = await this.client.patch<any>(`/users/${id}/status`, { status });

    // Handle nested API response structures
    const responseData = response.data;
    let userData: User | null = null;

    if (responseData?.data?.data?.id) {
      userData = responseData.data.data as User;
    } else if (responseData?.data?.id) {
      userData = responseData.data as User;
    } else if (responseData?.id) {
      userData = responseData as User;
    }

    if (!userData) {
      console.error('Could not extract user data from response:', responseData);
      throw new Error('Failed to extract user data from API response');
    }

    return {
      success: responseData.success !== false,
      data: userData,
      timestamp: responseData.timestamp || new Date().toISOString(),
    } as ApiResponse<User>;
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete<ApiResponse<void>>(`/users/${id}`);
    return response.data;
  }

  // Blog Methods
  async getBlogs(page = 1, limit = 10, published?: boolean): Promise<PaginatedResponse<Blog>> {
    try {
      const params: any = { page, limit };
      // Don't send published parameter - backend doesn't accept it
      // We'll filter client-side if needed

      const response = await this.client.get<ApiResponse<PaginatedResponse<Blog>>>('/blogs', {
        params,
      });

      // Handle nested response structure: response.data.data contains the actual data
      const responseData = response.data;
      let blogsData: PaginatedResponse<Blog>;

      // Handle nested API response structures
      if (responseData?.data?.data && Array.isArray(responseData.data.data)) {
        // Triple-nested: response.data.data.data (array) and response.data.meta
        blogsData = {
          success: responseData.success !== false,
          data: responseData.data.data,
          meta: responseData.data.meta || {
            page,
            limit,
            total: responseData.data.data.length,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
          timestamp: responseData.timestamp || new Date().toISOString(),
        };
      } else if (responseData?.data && Array.isArray(responseData.data)) {
        // Double-nested: response.data (array) - no meta in this structure
        blogsData = {
          success: responseData.success !== false,
          data: responseData.data,
          meta: {
            page,
            limit,
            total: responseData.data.length,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
          timestamp: responseData.timestamp || new Date().toISOString(),
        };
      } else if (
        responseData?.data &&
        typeof responseData.data === 'object' &&
        'data' in responseData.data
      ) {
        // Double nested: { success: true, data: { success: true, data: [...], meta: {...} } }
        blogsData = responseData.data as PaginatedResponse<Blog>;
      } else {
        // Single nested: { success: true, data: [...], meta: {...} }
        blogsData = responseData as unknown as PaginatedResponse<Blog>;
      }

      // Ensure meta exists
      if (!blogsData.meta) {
        blogsData.meta = {
          page,
          limit,
          total: blogsData.data?.length || 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        };
      }

      // Filter for published blogs if requested
      if (published === true && blogsData.data) {
        const publishedBlogs = blogsData.data.filter((blog) => {
          // Check if blog exists and has status field
          if (!blog) return false;
          // Normalize status to string and compare (handles both enum and string values)
          const blogStatus = blog.status ? String(blog.status).toUpperCase() : '';
          return blogStatus === BlogStatus.PUBLISHED;
        });
        blogsData = {
          ...blogsData,
          data: publishedBlogs,
          meta: {
            ...blogsData.meta,
            total: publishedBlogs.length,
          },
        };
      }

      return blogsData;
    } catch (error: any) {
      const errorDetails = {
        url: `${this.client.defaults.baseURL}/blogs`,
        params: { page, limit, published },
        error: error?.message,
        code: error?.code,
        status: error?.response?.status,
        data: error?.response?.data,
      };

      // Provide helpful error message for connection refused
      if (error?.code === 'ECONNREFUSED') {
        console.error('❌ API Connection Refused:', {
          ...errorDetails,
          message: `Cannot connect to backend API at ${this.client.defaults.baseURL}`,
          suggestion: 'Make sure your backend API is running on port 3000',
        });
      } else {
        console.error('API Error in getBlogs:', errorDetails);
      }

      throw error;
    }
  }

  async getBlogDetails(id: string): Promise<ApiResponse<Blog>> {
    try {
      const response = await this.client.get<any>(`/blogs/${id}/details`);

      // Handle nested API response structures
      const responseData = response.data;
      let blogData: Blog | null = null;

      // Try to extract blog from various nested structures
      if (responseData?.data?.data?.id) {
        // Triple-nested: response.data.data.data
        blogData = responseData.data.data as Blog;
      } else if (responseData?.data?.id) {
        // Double-nested: response.data.data
        blogData = responseData.data as Blog;
      } else if (responseData?.id) {
        // Direct: response.data
        blogData = responseData as Blog;
      }

      if (!blogData) {
        console.error('Could not extract blog data from response:', responseData);
        throw new Error('Failed to extract blog data from API response');
      }

      return {
        success: responseData.success !== false,
        data: blogData,
        timestamp: responseData.timestamp || new Date().toISOString(),
      } as ApiResponse<Blog>;
    } catch (error: any) {
      const errorDetails = {
        url: `${this.client.defaults.baseURL}/blogs/${id}/details`,
        error: error?.message,
        code: error?.code,
        status: error?.response?.status,
        data: error?.response?.data,
      };

      console.error('API Error in getBlogDetails:', errorDetails);
      throw error;
    }
  }

  async getBlogById(id: string): Promise<ApiResponse<Blog>> {
    const response = await this.client.get<ApiResponse<any>>(`/blogs/${id}`);
    // Handle nested response structure
    const responseData = response.data;

    // Check if double nested: { success: true, data: { success: true, data: {...} } }
    if (
      responseData.data &&
      typeof responseData.data === 'object' &&
      'id' in responseData.data &&
      'title' in responseData.data
    ) {
      // It's a Blog object directly
      return {
        success: responseData.success,
        data: responseData.data as Blog,
        timestamp: responseData.timestamp,
      };
    }

    // Check if single nested: { success: true, data: { success: true, data: {...} } }
    if (responseData.data && typeof responseData.data === 'object' && 'data' in responseData.data) {
      const innerData = responseData.data as ApiResponse<Blog>;
      return {
        success: innerData.success || responseData.success,
        data: innerData.data,
        timestamp: innerData.timestamp || responseData.timestamp,
      };
    }

    // Single nested: { success: true, data: {...} }
    return responseData as unknown as ApiResponse<Blog>;
  }

  async createBlog(data: CreateBlogDto): Promise<ApiResponse<Blog>> {
    const response = await this.client.post<ApiResponse<Blog>>('/blogs', data);
    return response.data;
  }

  async updateBlog(id: string, data: UpdateBlogDto): Promise<ApiResponse<Blog>> {
    const response = await this.client.patch<any>(`/blogs/${id}`, data);

    // Handle nested API response structures
    const responseData = response.data;
    let blogData: Blog | null = null;

    if (responseData?.data?.data?.id) {
      blogData = responseData.data.data as Blog;
    } else if (responseData?.data?.id) {
      blogData = responseData.data as Blog;
    } else if (responseData?.id) {
      blogData = responseData as Blog;
    }

    if (!blogData) {
      console.error('Could not extract blog data from response:', responseData);
      throw new Error('Failed to extract blog data from API response');
    }

    return {
      success: responseData.success !== false,
      data: blogData,
      timestamp: responseData.timestamp || new Date().toISOString(),
    } as ApiResponse<Blog>;
  }

  async updateBlogStatus(id: string, status: string): Promise<ApiResponse<Blog>> {
    const response = await this.client.patch<any>(`/blogs/${id}/status`, { status });

    // Handle nested API response structures
    const responseData = response.data;
    let blogData: Blog | null = null;

    if (responseData?.data?.data?.id) {
      blogData = responseData.data.data as Blog;
    } else if (responseData?.data?.id) {
      blogData = responseData.data as Blog;
    } else if (responseData?.id) {
      blogData = responseData as Blog;
    }

    if (!blogData) {
      console.error('Could not extract blog data from response:', responseData);
      throw new Error('Failed to extract blog data from API response');
    }

    return {
      success: responseData.success !== false,
      data: blogData,
      timestamp: responseData.timestamp || new Date().toISOString(),
    } as ApiResponse<Blog>;
  }

  async deleteBlog(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete<ApiResponse<void>>(`/blogs/${id}`);
    return response.data;
  }

  // Email Methods
  async sendEmail(data: SendEmailDto): Promise<void> {
    await this.client.post('/email/send', data);
  }

  async sendAdminNotification(to: string, subject: string, message: string): Promise<void> {
    await this.client.post('/email/admin-notification', { to, subject, message });
  }

  async sendUserNotification(to: string, subject: string, message: string): Promise<void> {
    await this.client.post('/email/user-notification', { to, subject, message });
  }

  // Image Methods
  /**
   * Upload an image file
   * @param file - The image file to upload
   * @param blogId - Optional blog ID to associate the image with
   * @returns The URL of the uploaded image
   */
  async uploadImage(file: File, blogId?: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      if (blogId) {
        formData.append('blogId', blogId);
      }

      const response = await this.client.post<any>('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle nested API response structures
      const responseData = response.data;
      let imageUrl: string | null = null;

      // Try to extract image URL from various nested structures
      if (responseData?.data?.data?.url) {
        imageUrl = responseData.data.data.url;
      } else if (responseData?.data?.data?.imageUrl) {
        imageUrl = responseData.data.data.imageUrl;
      } else if (responseData?.data?.url) {
        imageUrl = responseData.data.url;
      } else if (responseData?.data?.imageUrl) {
        imageUrl = responseData.data.imageUrl;
      } else if (responseData?.url) {
        imageUrl = responseData.url;
      } else if (responseData?.imageUrl) {
        imageUrl = responseData.imageUrl;
      } else if (typeof responseData?.data === 'string') {
        imageUrl = responseData.data;
      }

      if (!imageUrl) {
        console.error('Could not extract image URL from response:', responseData);
        throw new Error('Failed to extract image URL from API response');
      }

      return imageUrl;
    } catch (error: any) {
      const errorDetails = {
        url: `${this.client.defaults.baseURL}/images/upload`,
        error: error?.message,
        code: error?.code,
        status: error?.response?.status,
        data: error?.response?.data,
      };

      console.error('API Error in uploadImage:', errorDetails);
      throw error;
    }
  }

  /**
   * Get all images (with pagination)
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns Paginated list of images
   */
  async getImages(page = 1, limit = 10): Promise<PaginatedResponse<any>> {
    const response = await this.client.get<any>('/images', {
      params: { page, limit },
    });

    // Handle nested API response structures
    const responseData = response.data;
    let paginatedData: PaginatedResponse<any> | null = null;

    if (responseData?.data?.data && Array.isArray(responseData.data.data)) {
      paginatedData = {
        success: responseData.success !== false,
        data: responseData.data.data,
        meta: responseData.data.meta ||
          responseData.data.data.meta || {
            page,
            limit,
            total: responseData.data.data.length,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        timestamp: responseData.timestamp || new Date().toISOString(),
      };
    } else if (responseData?.data && Array.isArray(responseData.data)) {
      paginatedData = {
        success: responseData.success !== false,
        data: responseData.data,
        meta: responseData.meta || {
          page,
          limit,
          total: responseData.data.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        timestamp: responseData.timestamp || new Date().toISOString(),
      };
    } else if (Array.isArray(responseData)) {
      paginatedData = {
        success: true,
        data: responseData,
        meta: {
          page,
          limit,
          total: responseData.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        timestamp: new Date().toISOString(),
      };
    }

    if (!paginatedData) {
      throw new Error('Failed to extract images from API response');
    }

    return paginatedData;
  }

  /**
   * Get image by ID
   * @param id - Image ID
   * @returns Image data
   */
  async getImageById(id: string): Promise<ApiResponse<any>> {
    const response = await this.client.get<any>(`/images/${id}`);

    const responseData = response.data;
    let imageData: any = null;

    if (responseData?.data?.data) {
      imageData = responseData.data.data;
    } else if (responseData?.data) {
      imageData = responseData.data;
    } else if (responseData?.id || responseData?.url) {
      imageData = responseData;
    }

    if (!imageData) {
      throw new Error('Failed to extract image data from API response');
    }

    return {
      success: responseData.success !== false,
      data: imageData,
      timestamp: responseData.timestamp || new Date().toISOString(),
    };
  }

  /**
   * Delete an image by ID
   * @param id - Image ID
   * @returns Success response
   */
  async deleteImage(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete<any>(`/images/${id}`);

    return {
      success: response.data?.success !== false,
      data: undefined,
      timestamp: response.data?.timestamp || new Date().toISOString(),
    };
  }

  /**
   * Set an image as featured for a blog
   * @param blogId - Blog ID
   * @param imageId - Image ID to set as featured
   * @returns Updated image data
   */
  async setFeaturedImage(blogId: string, imageId: string): Promise<ApiResponse<any>> {
    try {
      // PATCH /images/{id} with isFeaturedImage in body
      const response = await this.client.patch<any>(`/images/${imageId}`, {
        isFeaturedImage: true,
      });

      const responseData = response.data;
      let imageData: any = null;

      if (responseData?.data?.data) {
        imageData = responseData.data.data;
      } else if (responseData?.data) {
        imageData = responseData.data;
      } else if (responseData?.id || responseData?.url) {
        imageData = responseData;
      }

      if (!imageData) {
        throw new Error('Failed to extract image data from API response');
      }

      return {
        success: responseData.success !== false,
        data: imageData,
        timestamp: responseData.timestamp || new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('Error setting featured image:', error);
      throw error;
    }
  }

  /**
   * Update an image (if your API supports it)
   * @param id - Image ID
   * @param file - New image file (optional)
   * @param metadata - Image metadata to update (optional)
   * @returns Updated image data
   */
  async updateImage(
    id: string,
    file?: File,
    metadata?: Record<string, any>
  ): Promise<ApiResponse<any>> {
    const formData = new FormData();

    if (file) {
      formData.append('image', file);
    }

    if (metadata) {
      Object.keys(metadata).forEach((key) => {
        formData.append(key, metadata[key]);
      });
    }

    const response = await this.client.put<any>(`/images/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const responseData = response.data;
    let imageData: any = null;

    if (responseData?.data?.data) {
      imageData = responseData.data.data;
    } else if (responseData?.data) {
      imageData = responseData.data;
    } else if (responseData?.id || responseData?.url) {
      imageData = responseData;
    }

    if (!imageData) {
      throw new Error('Failed to extract image data from API response');
    }

    return {
      success: responseData.success !== false,
      data: imageData,
      timestamp: responseData.timestamp || new Date().toISOString(),
    };
  }

  /**
   * Fetch image by URL through the backend API
   * @param imageUrl - The URL of the image to fetch
   * @returns Blob of the image data
   */
  async fetchImageByUrl(imageUrl: string): Promise<Blob> {
    try {
      const response = await this.client.get('/images', {
        params: { url: imageUrl },
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching image:', {
        url: imageUrl,
        error: error?.message,
        status: error?.response?.status,
      });
      throw error;
    }
  }

  /**
   * Get image URL through API proxy
   * This constructs a URL that goes through your backend image API
   * @param imageUrl - The original image URL
   * @returns The proxied image URL through your API
   */
  getImageUrl(imageUrl: string | undefined | null): string {
    if (!imageUrl) {
      return '/placeholder-image.jpg'; // Fallback placeholder
    }

    // If it's already a full URL, proxy it through the API
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      const apiUrl = this.client.defaults.baseURL || 'http://127.0.0.1:3000';
      return `${apiUrl}/images?url=${encodeURIComponent(imageUrl)}`;
    }

    // If it's a relative path, construct full URL through API
    const apiUrl = this.client.defaults.baseURL || 'http://127.0.0.1:3000';
    return `${apiUrl}/images?url=${encodeURIComponent(imageUrl)}`;
  }

  /**
   * Get direct image URL (bypasses API proxy)
   * Use this if you want to use the image URL directly without going through the API
   * @param imageUrl - The image URL
   * @returns The original URL or placeholder
   */
  getDirectImageUrl(imageUrl: string | undefined | null): string {
    if (!imageUrl) {
      return '/placeholder-image.jpg';
    }
    return imageUrl;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
