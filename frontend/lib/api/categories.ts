import api from "./client";
import type { Category } from "@/types";

export const categoriesAPI = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get("/categories");
    return response.data;
  },

  getOne: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
};
