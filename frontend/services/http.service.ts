import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class HttpService {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error.response?.data?.message ?? 'An unexpected error occurred';
        return Promise.reject(new Error(message));
      },
    );
  }

  async get<T>(url: string, query?: Record<string, unknown>): Promise<T> {
    const config: AxiosRequestConfig = {
      params: query,
    };

    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T, B = unknown>(url: string, body: B): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, body);
    return response.data;
  }

  async patch<T, B = unknown>(url: string, body: B): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, body);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url);
    return response.data;
  }
}

export const httpService = new HttpService();
