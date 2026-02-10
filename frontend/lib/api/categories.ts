import api from "./client";
import type { Category } from "@/types";

export interface CreateCategoryRequest {
  name: string;
  side: "income" | "expense";
  icon?: string;
  color?: string;
}

export const categoriesAPI = {
  getAll: async (): Promise<Category[]> => {
    // Add timestamp to bypass browser cache
    const response = await api.get(`/categories?_t=${Date.now()}`);
    return response.data;
  },

  getOne: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}?_t=${Date.now()}`);
    return response.data;
  },

  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await api.post("/categories", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<CreateCategoryRequest>,
  ): Promise<Category> => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
